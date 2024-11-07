import uuid
import scrapy
import multiprocessing
import os
import re
import requests
import logging
import smtplib
import ssl

from email.message import EmailMessage
from datetime import datetime, date
from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Tuple
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse, parse_qs, urlunparse, unquote
from fnmatch import fnmatch
from validators import url as url_validate
from validators.utils import ValidationError
from fpdf import FPDF

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

from app.schemas.scrappy import ScrappyEmails, EditalsPayload
from app.utils.validators import validate_date

logger = logging.getLogger("SmartyUtilsAPI")
asyncioreactor.install()
router = APIRouter()

prefix_dir = "/mnt/scrappers"

class WaitReponse:
    object_content: Union[List[JSONResponse], List[FileResponse]] = []
    allowed_types: List[str] = ["file", "txt", "pdf"]
    editals_sufix: List[str] = ["finep_editals.txt", "inovativabrasil_editals.txt", "fundep_editals.txt", "bnds_editals.txt"]

    def __init__(self, file_prefix: str, type_return: str, method: str = "", test_file: str = ""):
        if test_file:
            file_path = f"{prefix_dir}/{test_file}"
            if type_return == "pdf":
                file_response_path = file_path
                if file_path.endswith(".txt"):
                    file_response_path = file_path.replace(".txt", ".pdf")
                    logger.error(f"file_response_path: {file_response_path}")
                    txt_to_pdf(file_path, file_response_path)
                self.object_content.append(
                    FileResponse(
                        file_response_path,
                        media_type='application/octet-stream',
                        filename=test_file,
                        headers={"Content-Disposition": f"attachment; filename={test_file.replace(".txt", ".pdf")}"}
                    )
                )
            elif type_return == "txt":
                self.object_content.append(
                    FileResponse(
                        file_path,
                        media_type='application/octet-stream',
                        filename=test_file,
                        headers={"Content-Disposition": f"attachment; filename={test_file.replace(".txt", ".pdf")}"}
                    )
                )
            return

        for _root, _dir, files in os.walk(prefix_dir):
            for _file in files:
                if method == "get_editals":
                    for _saved_file_name in self.editals_sufix:
                        if fnmatch(_file, f"{file_prefix}_{_saved_file_name}"):
                            if type_return in self.allowed_types:
                                file_path = f"{prefix_dir}/{_file}"
                                if type_return == "pdf":
                                    file_response_path = file_path.replace(".txt", ".pdf")
                                    txt_to_pdf(file_path, file_response_path)
                                    self.object_content.append(
                                        FileResponse(
                                            file_response_path,
                                            media_type='application/octet-stream',
                                            filename=_file.replace(".txt", ".pdf"),
                                            headers={"Content-Disposition": f"attachment; filename={_file.replace(".txt", ".pdf")}"}
                                        )
                                    )
                                elif type_return == "txt":
                                    self.object_content.append(
                                        FileResponse(
                                            file_path,
                                            media_type='application/octet-stream',
                                            filename=_file,
                                            headers={"Content-Disposition": f"attachment; filename={_file}"}
                                        )
                                    )
                else: 
                    file_path = f"{prefix_dir}/{_file}"
                    if type_return == "file":
                        self.object_content = [FileResponse(
                            file_path,
                            media_type='application/octet-stream',
                            filename=_file,
                            headers={"Content-Disposition": f"attachment; filename={_file}"}
                        )]
                    elif type_return == "json":
                        with open(file_path, "r") as fc:
                            content = fc.read()
                        content_list = [item for item in content.split("\n") if item]
                        content_list = list(dict.fromkeys(content_list))
                        self.object_content = [JSONResponse(status_code=200, content={"response": content_list})]

        if not self.object_content:
            self.object_content = [JSONResponse(status_code=404, content={"detail": "Not found."})]


def send_email_with_attachment(sender_email: str, receiver_email: str, subject: str, body: str, attachments: List[FileResponse]):
    msg = EmailMessage()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.set_content(body)

    try:
        for _attach in attachments:
            logger.error(f"_attach: {_attach.__dict__}")
            with open(_attach.path, 'rb') as f:
                file_data = f.read()
                file_name = f.name
                msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)
    except Exception as e:
        logger.error(f"Erro ao anexar o arquivo: {e}")
        return

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(os.environ["SMTP-HOST"], os.environ["SMTP-PORT"]) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(os.environ["SMTP-USER"], os.environ["SMTP-PASS"])
            server.send_message(msg)
            logger.info("E-mail enviado com sucesso!")
    except Exception as e:
        logger.error(f"Erro ao enviar o e-mail: {e}")


def txt_to_pdf(txt_file, pdf_file):
    # Cria o objeto PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=10)
    pdf.add_font(fname=r'fonts/DejaVuSansCondensed.ttf')
    pdf.set_font('DejaVuSansCondensed', size=12)
    
    # Abre o arquivo .txt e adiciona cada linha ao PDF
    with open(txt_file, "r", encoding="utf-8") as file:
        for line in file:
            pdf.cell(200, 10, txt=line.strip(), ln=True)
    
    # Salva o PDF
    pdf.output(pdf_file)


def save_edital(file_path: str, config_edital: dict):
    content = f"""
URL: {config_edital["url"]}
TITULO: {config_edital["title"]}
DESCRIÇÃO: {config_edital["description"]}
DATA PUBLICAÇÃO: {config_edital["publication_date"]}
PRAZO ENVIO: {config_edital["proposal_deadline"]}
FONTE RECURSO: {config_edital["resource_source"]}
PUBLICO ALVO: {config_edital["target_audience"]}
TEMA(S): {config_edital["theme"]}
"""
    with open(file_path, "a") as f:
        f.write(f"{content}\n------------------------------------\n")


def get_pages(url) -> List:
    response_list = []
    response_list.append(url)
    parsed_url = urlparse(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    if parsed_url.netloc == "www.finep.gov.br":
        pagination_text = soup.find('div', class_='pagination').find('p', class_='counter pull-right').get_text(strip=True)
        pagina_atual, total_paginas = map(int, pagination_text.replace('Pagina', '').split('de'))
        query_params = parse_qs(parsed_url.query)
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
        self, urls: str, file_id: str, method: str, full_site: bool = False, config: dict = {},
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
        self.config = config

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

                file_name = f"{self.file_id}_finep_editals.txt"
                file_path = f"{prefix_dir}/{file_name}"
                response_url = unquote(response.url.split("url=")[1])
                logger.info(f"URL DA VEZ::::: {response_url}")

                if "/chamadapublica/" not in response_url:

                    for _next_page in response.css("a::attr(href)").extract():
                        if _next_page.startswith("/chamadas-publicas/chamadapublica/"):
                            next_url = f"http://{self.parsed_url.netloc}{_next_page}"
                            logger.info(next_url)
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
                    
                    
                    edital = {
                        "url": url,
                        "title": title.strip(),
                        "description": description.strip(),
                        "publication_date": publication_date.strip() if publication_date else "",
                        "proposal_deadline": proposal_deadline.strip() if proposal_deadline else "",
                        "resource_source": resource_source.strip() if resource_source else "",
                        "target_audience": target_audience.strip() if target_audience else "",
                        "theme": theme.strip() if theme else "",
                    }
                    if filter_edital(self.config, edital):
                        save_edital(file_path, edital)
                        logger.info(f"SALVANDO LICITAÇÃO: {url}\nPRAZO: {edital['proposal_deadline']} PUBLICAÇÃO: {edital['publication_date']}")
                    else:
                        logger.info(f"IGNORANDO LICITAÇÃO: {url}\nPRAZO: {edital['proposal_deadline']} PUBLICAÇÃO: {edital['publication_date']}")
        
        else:
            raise HTTPException(status_code=400, detail="Method not allowed")
        
        
def filter_edital(filter_config: dict, edital_config: dict) -> bool:
    today = datetime.today().date()
    publication_date = None
    proposal_deadline = None
    try:
        publication_date = validate_date(edital_config["publication_date"])
        proposal_deadline = validate_date(edital_config["proposal_deadline"])
    except:
        pass
    if proposal_deadline:
        if today > proposal_deadline:
            return False
    if publication_date:
        if publication_date < filter_config["start_date"]:
            return False
    if filter_config["tags"]:
        if not any(tag in edital_config["theme"] for tag in filter_config["tags"]) and not any(tag in edital_config["title"] for tag in filter_config["tags"]):
            return False
    return True


def run_crawler(urls: list, file_id: str, full_site: bool, method: str, error_queue: multiprocessing.Queue, config: dict = {}):
    Settings()
    crawler = CrawlerProcess(
        settings={
            "CONCURRENT_REQUESTS": 5,
            "DOWNLOAD_DELAY": 10,
            "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
            "INSTALL_SIGNAL_HANDLERS": False,
            "LOG_LEVEL": "WARNING",
            "LOG_STDOUT": False,
        }
    )

    for url in urls:
        if isinstance(url_validate(url), ValidationError):
            e = HTTPException(status_code=400, detail="URL is not a valid url")
            error_queue.put((e.status_code, e.detail))
            raise e

    crawler.crawl(TextSpider, urls, file_id, method, full_site=full_site, config=config)
    crawler.start()
    if config["response_email"]:
        crawler_response = WaitReponse(file_id, config["type_response"], "get_editals")
        send_email_with_attachment(
            sender_email=os.environ["SMTP-SENDER"],
            receiver_email=config["response_email"], 
            subject="Editais 2024",
            body="",
            attachments=crawler_response.object_content
        )


@router.post(
    "/get_emails",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
@version(1, 0)
def get_emails(
    request: Request,
    payload: Annotated[ScrappyEmails, Body(title="Dados do request.")],
) -> Union[FileResponse, JSONResponse]:
    error_queue = multiprocessing.Queue()
    
    file_prefix = str(uuid.uuid4())
    process = multiprocessing.Process(
        target=run_crawler,
        args=([payload.url], file_prefix, payload.full_site, "get_emails", error_queue)
    )
    process.start()
    process.join()

    if process.exitcode != 0 and not error_queue.empty():
        error_status_code, error_detail = error_queue.get()
        return JSONResponse(status_code=error_status_code, content={"detail": error_detail})

    response = WaitReponse(file_prefix, payload.type_reponse, process)
    return response.object_content


@router.post(
    "/get_editals",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
@version(1, 0)
def get_editals(
    request: Request,
    payload: Annotated[EditalsPayload, Body(title="Dados do request")],
) -> Union[List[FileResponse], HTTPException, JSONResponse]:

    if payload.existing_file:
        file_prefix = payload.existing_file.split("_")[0]
        response = WaitReponse(file_prefix, payload.type_response, "get_editals", test_file=payload.existing_file)
        send_email_with_attachment(
            sender_email=os.environ["SMTP-SENDER"],
            receiver_email=payload.response_email, 
            subject="Editais 2024",
            body="",
            attachments=response.object_content
        )
        return response.object_content
    
    start_date = validate_date(payload.start_date)
    config = {
        "start_date": start_date,
        "tags": payload.filter_tags,
        "type_response": payload.type_response,
        "response_email": payload.response_email,
    }
    start_urls: List[str] = [
        "http://www.finep.gov.br/chamadas-publicas?situacao=aberta&start=0",
        # "https://www.inovativabrasil.com.br/editais/",
        # "https://www.fundep.ufmg.br/novos-editais/",
        # "https://www.bndes.gov.br/wps/portal/site/home/onde-atuamos/inovacao/chamadas-publicas/",
    ]
    urls: List[str] = []
    for _url in start_urls:
        total_pages = get_pages(_url)
        [urls.append(_page) for _page in total_pages]
    
    error_queue = multiprocessing.Queue()
    file_prefix = str(uuid.uuid4())
    process = multiprocessing.Process(
        target=run_crawler,
        args=(urls, file_prefix, False, "get_editals", error_queue, config)
    )
    process.start()

    if not payload.response_email:
        process.join()
        if process.exitcode != 0 and not error_queue.empty():
            error_status_code, error_detail = error_queue.get()
            return JSONResponse(status_code=error_status_code, content={"detail": error_detail})
        
        response = WaitReponse(file_prefix, payload.type_response, "get_editals")
        return response.object_content

    return JSONResponse(status_code=201, content={"detail": "Process successfully started."})

    
