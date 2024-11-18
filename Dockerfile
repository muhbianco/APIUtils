FROM python:3.12.3-alpine
ARG ENV_FILE
RUN apk upgrade
RUN apk add gcc build-base python3-dev musl-dev \
			libc-dev libcurl curl-dev gpgme-dev make libmagic jpeg-dev \
			zlib-dev libjpeg supervisor bash ffmpeg git \
                        libxml2-dev libxslt-dev python3.12-dev
RUN mkdir -p /usr/src/environments/api_utils && mkdir /mnt/scrappers
WORKDIR /usr/src/environments/api_utils/
RUN git clone -b master https://github.com/muhbianco/APIUtils.git .
COPY $ENV_FILE .env
RUN pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
RUN chmod +x /usr/src/environments/api_utils/entrypoint.sh
ENTRYPOINT ["/usr/src/environments/api_utils/entrypoint.sh"]
