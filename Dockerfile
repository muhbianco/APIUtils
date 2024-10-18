FROM python:3.12.3-alpine
RUN apk upgrade
RUN apk add gcc build-base python3-dev musl-dev \
			libc-dev libcurl curl-dev gpgme-dev make libmagic jpeg-dev \
			zlib-dev libjpeg supervisor bash ffmpeg git
RUN mkdir -p /usr/src/environments/api_utils && mkdir /mnt/scrappers
WORKDIR /usr/src/environments/api_utils/
RUN git clone https://github.com/muhbianco/APIUtils.git .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN chmod +x /usr/src/environments/api_utils/entrypoint.sh
ENTRYPOINT ["/usr/src/environments/api_utils/entrypoint.sh"]
