import uuid
import scrapy
import multiprocessing
import os
import time

from typing_extensions import TypedDict
from typing import List, Annotated, Any
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse
from fnmatch import fnmatch

from fastapi import APIRouter, Request, status, Body
from fastapi_versioning import version
from fastapi.responses import FileResponse

from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.settings import Settings
from scrapy_splash import SplashRequest

from twisted.internet import asyncioreactor

from app.schemas.scrappy import ScrappyBase

asyncioreactor.install()
router = APIRouter()

def get_scrapeops_url(url):
    api_key = "d4a17a9b-ea30-4d85-aae8-3ce14df28f41"
    payload = {"api_key": api_key, "url": url}
    proxy_url = "https://proxy.scrapeops.io/v1/?" + urlencode(payload)
    return proxy_url


class TextSpider(scrapy.Spider):
    name = "text_spider"

    start_urls: List[str] = []
    allowed_domains: List[str] = []

    def __init__(
        self, url: str, file_id: str, full_site: bool = False,
    ):
        self.parsed_url = urlparse(url)
        self.start_urls = [url]
        self.allowed_domains = [self.parsed_url.netloc, "proxy.scrapeops.io"]
        self.full_site = full_site
        self.link_extractor = LinkExtractor()
        self.file_id = file_id

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

        file_name = f"{self.file_id}.{file_type}"
        print("FILE_NAME", file_name)
        file_path = f"/mnt/scrappers/{file_name}"
        with open(file_path, "wb") as f:
            f.write(response.body)

@router.post(
    "/",
    status_code=status.HTTP_200_OK,
    responses={
        400: {
            "description": "Any error!",
        }
    },
)
@version(1, 0)
def web_scrappy(
    request: Request,
    payload: Annotated[ScrappyBase, Body(title="Dados do request.")],
) -> Any:

    def run_crawler(url: str, file_id: str):
        Settings()
        crawler = CrawlerProcess(
            settings={
                "CONCURRENT_REQUESTS": 5,
                "DOWNLOAD_DELAY": 10,
                "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
                "INSTALL_SIGNAL_HANDLERS": False,
            }
        )
        crawler.crawl(TextSpider, payload.url, file_id)
        crawler.start()

    file_prefix = str(uuid.uuid4())
    process = multiprocessing.Process(target=run_crawler, args=(payload.url, file_prefix, ))
    process.start()
    process.join()

    prefix_dir = "/mnt/scrappers"


    response_file = None
    start_time = time.time()
    while response_file is None and (time.time() - start_time) < 60:
        for _root, _dir, files in os.walk(prefix_dir):
            for _file in files:
                if fnmatch(_file, f"{file_prefix}*"):
                    response_file = _file
                    return FileResponse(f"{prefix_dir}/{response_file}", media_type='application/octet-stream', filename=response_file)
                else:
                    return {"error": "File not found"}
        time.sleep(1)

    