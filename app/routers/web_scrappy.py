import uuid
import scrapy
import multiprocessing
import os
import re
import requests
import logging

from datetime import datetime
from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Tuple
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse, parse_qs, urlunparse, unquote
from fnmatch import fnmatch
from validators import url as url_validate
from validators.utils import ValidationError

from fastapi import APIRouter, Request, status, Body, HTTPException, Query
from fastapi_versioning import version
from fastapi.responses import FileResponse, JSONResponse

from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.settings import Settings
from scrapy_splash import SplashRequest

from twisted.internet import asyncioreactor

from bs4 import BeautifulSoup

from newspaper import Article

from app.schemas.scrappy import ScrappyEmails, TypeResponse

logger = logging.getLogger("SmartyUtilsAPI")
asyncioreactor.install()
router = APIRouter()

prefix_dir = "/mnt/scrappers"

def get_pages(url) -> List:
    response_list = []
    response_list.append(url)
    parsed_url = urlparse(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    print(parsed_url.netloc)
    if parsed_url.netloc == "www.finep.gov.br":
        pagination_text = soup.find('div', class_='pagination').find('p', class_='counter pull-right').get_text(strip=True)
        pagina_atual, total_paginas = map(int, pagination_text.replace('Pagina', '').split('de'))
        print(f"{pagina_atual}, {total_paginas}")
        query_params = parse_qs(parsed_url.query)
        print(query_params)
        for i in range(pagina_atual, total_paginas):
            query_params['start'] = i*10
            new_query = urlencode(query_params, doseq=True)
            new_url = urlunparse(parsed_url._replace(query=new_query))
            response_list.append(new_url)
        return response_list
    else:
        # TODO OUTRAS PAGINAS
        pass

def get_scrapeops_url(url):
    api_key = "d4a17a9b-ea30-4d85-aae8-3ce14df28f41"
    payload = {"api_key": api_key, "url": url}
    proxy_url = "https://proxy.scrapeops.io/v1/?" + urlencode(payload)
    return proxy_url


def html_cleanner(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    return soup.get_text()


def extract_article(url: str) -> Article:
    article = Article(url)
    article.download()
    article.parse()
    #article.title article.text
    return article


def extract_emails(text: str) -> List[str]:
    # Expressão regular para capturar e-mails
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    return re.findall(email_pattern, text)


class TextSpider(scrapy.Spider):
    name = "text_spider"

    start_urls: List[str] = []
    allowed_domains: List[str] = []

    def __init__(
        self, urls: str, file_id: str, method: str, full_site: bool = False,
    ):
        self.start_urls = urls
        self.allowed_domains = ["proxy.scrapeops.io"]
        for url in self.start_urls:
            self.parsed_url = urlparse(url)
            if self.parsed_url.netloc not in self.allowed_domains:
                self.allowed_domains.append(self.parsed_url.netloc)
        self.full_site = full_site
        self.link_extractor = LinkExtractor()
        self.file_id = file_id
        self.email_list = []
        self.method = method
        self.today = datetime.today()

        self.log(f"ALLOWED DOMAINS: {pformat(self.allowed_domains)}")

        ua = (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) "
            + "Gecko/20100101 Firefox/121.0"
        )
        a = (
            "text/html,application/xhtml+xml,application/xml;q=0.9,"
            + "image/avif,image/webp,*/*;q=0.8"
        )
        self.HEADERS = {
            "User-Agent": ua,
            "Accept": a,
            "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
        }

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(
                get_scrapeops_url(url),
                self.parse,
                headers=self.HEADERS,
                args={"wait": 5},
            )

    def parse(self, response):
        content_type = response.headers.get("Content-Type", b"").decode("utf-8").lower()

        file_type = None
        if "application/pdf" in content_type:
            file_type = "pdf"
        elif "application/msword" in content_type:
            file_type = "doc"
        elif "text/html" in content_type:
            file_type = "html"
        else:
            return

        if self.method == "get_emails":
            page_text = html_cleanner(response.text)
            emails = extract_emails(page_text)
            file_name = f"{self.file_id}_emails.txt"
            file_path = f"{prefix_dir}/{file_name}"
            with open(file_path, "a") as f:
                for email in emails:
                    if email not in self.email_list:
                        self.email_list.append(email)
                        f.write(f"{email}\n")
            self.log(f"Captured emails: {emails}")

        
        elif self.method == "get_editals":

            self.log(f"DOMAIN: {self.parsed_url.netloc}")
            if self.parsed_url.netloc == "www.finep.gov.br":
                response_url = unquote(response.url.split("url=")[1])
                self.log(f"URL DA VEZ::::: {response_url}")
                if "/chamadapublica/" not in response_url:
                    for _next_page in response.css("a::attr(href)").extract():
                        if _next_page.startswith("/chamadas-publicas/chamadapublica/"):
                            next_url = f"http://{self.parsed_url.netloc}{_next_page}"
                            self.log(next_url)
                            yield SplashRequest(
                                get_scrapeops_url(next_url),
                                self.parse,
                                headers=self.HEADERS,
                                args={"wait": 5},
                            )
                elif "/chamadapublica/" in response_url:

                    url = response_url
                    title = response.css("h2.tit_pag a::text").get()
                    description_object = response.css("div.group.desc div.text p::text").getall()
                    description = html_cleanner("\n".join([obj.strip() for obj in description_object if obj]))
                    publication_date = response.xpath(
                    '//div[@class="group"]/div[@class="tit" and normalize-space(text())="Data de Publicação:"]/following-sibling::div[@class="text"]/text()'
                    ).get()
                    proposal_deadline = response.xpath(
                    '//div[@class="group"]/div[@class="tit" and normalize-space(text())="Prazo para envio de propostas até:"]/following-sibling::div[@class="text"]/text()'
                    ).get()
                    resource_source = response.xpath(
                    '//div[@class="group"]/div[@class="tit" and normalize-space(text())="Fonte de Recurso:"]/following-sibling::div[@class="text"]/text()'
                    ).get()
                    target_audience = response.xpath(
                    '//div[@class="group"]/div[@class="tit" and normalize-space(text())="Público-alvo:"]/following-sibling::div[@class="text"]/text()'
                    ).get()
                    theme = response.xpath(
                    '//div[@class="group"]/div[@class="tit" and normalize-space(text())="Tema(s):"]/following-sibling::div[@class="text"]/text()'
                    ).get()
                    file_name = f"{self.file_id}_finep_editals.txt"
                    file_path = f"{prefix_dir}/{file_name}"
                    content = f"""
URL: {url}
TITULO: {title.strip()}
DESCRIÇÃO: {description.strip()}
DATA PUBLICAÇÃO: {publication_date.strip() if publication_date else ""}
PRAZO ENVIO: {proposal_deadline.strip() if proposal_deadline else ""}
FONTE RECURSO: {resource_source.strip() if resource_source else ""}
PUBLICO ALVO: {target_audience.strip() if target_audience else ""}
TEMA(S): {theme.strip() if theme else ""}
"""
                    date_objeto = ""
                    if proposal_deadline:
                        date_objeto = datetime.strptime(proposal_deadline, "%d/%m/%Y")
                    if not date_objeto or self.today >= date_objeto:
                        with open(file_path, "a") as f:
                            f.write(f"{content}\n\n\n\n------------------------------------\n\n\n\n")
                    else:
                        self.log(f"IGNORANDO LICITAÇÃO: {url}\nPRAZO: {proposal_deadline}")
        
        
        else:
            raise HTTPException(status_code=400, detail="Method not allowed")


class WaitReponse:
    object_content: FileResponse | JSONResponse = JSONResponse(status_code=404, content={"detail": "Not found."})

    def __init__(self, file_prefix: str, type_return: str, process: multiprocessing.Process):
        # response_file = None
        # start_time = time.time()
        # while response_file is None and (time.time() - start_time) < 60:
        for _root, _dir, files in os.walk(prefix_dir):
            for _file in files:
                if fnmatch(_file, f"{file_prefix}_emails.txt"):
                    response_file = _file
                    file_path = f"{prefix_dir}/{response_file}"
                    if type_return == "file":
                        self.object_content = FileResponse(
                            file_path,
                            media_type='application/octet-stream',
                            filename=response_file,
                            headers={"Content-Disposition": f"attachment; filename={response_file}"}
                        )
                    elif type_return == "json":
                        with open(file_path, "r") as fc:
                            content = fc.read()
                        content_list = [item for item in content.split("\n") if item]
                        content_list = list(dict.fromkeys(content_list))
                        self.object_content = JSONResponse(status_code=200, content={"response": content_list})
        #     time.sleep(1)

def run_crawler(urls: list, file_id: str, full_site: bool, method: str, error_queue: multiprocessing.Queue):
    Settings()
    crawler = CrawlerProcess(
        settings={
            "CONCURRENT_REQUESTS": 5,
            "DOWNLOAD_DELAY": 10,
            "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
            "INSTALL_SIGNAL_HANDLERS": False,
            "LOG_LEVEL": "DEBUG",
            "LOG_STDOUT": True,
        }
    )

    for url in urls:
        if isinstance(url_validate(url), ValidationError):
            e = HTTPException(status_code=400, detail="URL is not a valid url")
            error_queue.put((e.status_code, e.detail))
            raise e

    crawler.crawl(TextSpider, urls, file_id, method, full_site=full_site)
    crawler.start()


@router.post(
    "/get_emails",
    status_code=status.HTTP_200_OK,
    responses={
        400: {
            "description": "Any error!",
        }
    },
)
@version(1, 0)
def get_emails(
    request: Request,
    payload: Annotated[ScrappyEmails, Body(title="Dados do request.")],
) -> FileResponse or JSONResponse:
    error_queue = multiprocessing.Queue()
    
    file_prefix = str(uuid.uuid4())
    process = multiprocessing.Process(
        target=run_crawler,
        args=(payload.url, file_prefix, payload.full_site, "get_emails", error_queue)
    )
    process.start()
    process.join()

    if process.exitcode != 0 and not error_queue.empty():
        error_status_code, error_detail = error_queue.get()
        return JSONResponse(status_code=error_status_code, content={"detail": error_detail})

    response = WaitReponse(file_prefix, payload.type_reponse, process)
    return response.object_content

@router.get(
    "/get_editals",
    status_code=status.HTTP_200_OK,
    responses={
        400: {
            "description": "Any error!",
        }
    },
)
@version(1, 0)
def get_editals(
    request: Request,
    type_response: Annotated[
        TypeResponse, Query(description="Tipo de retorno")
    ] = "json"
) -> FileResponse or JSONResponse:
    
    start_urls: List[str] = ["http://www.finep.gov.br/chamadas-publicas?situacao=aberta&start=0"]
    urls: List[str] = []
    for _url in start_urls:
        total_pages = get_pages(_url)
        [urls.append(_page) for _page in total_pages]
    
    error_queue = multiprocessing.Queue()
    file_prefix = str(uuid.uuid4())
    process = multiprocessing.Process(
        target=run_crawler,
        args=(urls, file_prefix, False, "get_editals", error_queue)
    )
    process.start()
    process.join()

    if process.exitcode != 0 and not error_queue.empty():
        error_status_code, error_detail = error_queue.get()
        return JSONResponse(status_code=error_status_code, content={"detail": error_detail})

    response = WaitReponse(file_prefix, type_response, process)
    return response.object_content
