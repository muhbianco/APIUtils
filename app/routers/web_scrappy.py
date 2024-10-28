import uuid
import scrapy
import multiprocessing
import os
import time
import re
import inspect

from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Tuple
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse
from fnmatch import fnmatch
from validators import url as url_validate
from validators.utils import ValidationError

from fastapi import APIRouter, Request, status, Body, HTTPException
from fastapi_versioning import version
from fastapi.responses import FileResponse, JSONResponse

from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.settings import Settings
from scrapy_splash import SplashRequest

from twisted.internet import asyncioreactor

from bs4 import BeautifulSoup

from newspaper import Article

from app.schemas.scrappy import ScrappyEmails

asyncioreactor.install()
router = APIRouter()

prefix_dir = "/mnt/scrappers"

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
        self, url: str, file_id: str, full_site: bool = False, get_emails: bool = False
    ):
        self.allowed_methods: List[str] = ["get_email"]
        self.parsed_url = urlparse(url)
        self.start_urls = [url]
        self.allowed_domains = [self.parsed_url.netloc, "proxy.scrapeops.io"]
        self.full_site = full_site
        self.link_extractor = LinkExtractor()
        self.file_id = file_id
        self.get_emails = get_emails
        self.email_list = []

        self.caller = inspect.stack().function
        if self.caller not in self.allowed_methods:
            raise HTTPException(status_code=400, detail="Method not allowed")

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

        if self.full_site and file_type == "html":
            # Following links from the same subdomain
            for next_page in response.css("a::attr(href)").extract():
                next_url = urljoin(self.start_urls[0], next_page)
                parsed_next_url = urlparse(next_url)
                if parsed_next_url.netloc in self.allowed_domains:
                    yield SplashRequest(
                        get_scrapeops_url(next_url),
                        self.parse,
                        headers=self.HEADERS,
                        args={"wait": 5},
                    )

        if self.caller == "get_emails":
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

        else:
            raise HTTPException(status_code=400, detail="Method not allowed")


class WaitReponse:
    object_content: FileResponse | JSONResponse = JSONResponse(status_code=404, content={"detail": "Not found."})

    def __init__(self, file_prefix: str, type_return: str):
        response_file = None
        start_time = time.time()
        while response_file is None and (time.time() - start_time) < 20:
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
            time.sleep(1)

def run_crawler(url: str, file_id: str, full_site: bool, error_queue: multiprocessing.Queue):
    print("validando url")
    try:
        if isinstance(url_validate(url), ValidationError):
            print("deu merda")
            raise HTTPException(status_code=400, detail="URL is not a valid url")

        Settings()
        crawler = CrawlerProcess(
            settings={
                "CONCURRENT_REQUESTS": 5,
                "DOWNLOAD_DELAY": 10,
                "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
                "INSTALL_SIGNAL_HANDLERS": False,
            }
        )
        crawler.crawl(TextSpider, url, file_id, full_site=full_site)
        crawler.start()
    except HTTPException as e:
        print("add na fila?")
        error_queue.put((e.status_code, e.detail))
        raise HTTPException(status_code=400, detail="URL is not a valid url")


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
    process = multiprocessing.Process(target=run_crawler, args=(payload.url, file_prefix, payload.full_site, error_queue))
    process.start()
    process.join()

    if process.exitcode != 0 and not error_queue.empty():
        error_status_code, error_detail = error_queue.get()
        return JSONResponse(status_code=error_status_code, content={"detail": error_detail})
    

    print("ta vindo pra cá?")
    response = WaitReponse(file_prefix, payload.type_reponse)
    return response.object_content
