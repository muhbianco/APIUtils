FROM python:3.12.3-alpine
ARG APP_ENV=dev

ENV MINIO_ACCESS_KEY
ENV MINIO_SECRET_KEY
ENV MINIO_URL
ENV EVO_API_URL
ENV EVO_API_KEY
ENV SMTP_HOST
ENV SMTP_USER
ENV SMTP_PASS
ENV SMTP_PORT
ENV SMTP_SENDER

RUN apk upgrade
RUN apk add gcc build-base python3-dev musl-dev \
			libc-dev libcurl curl-dev gpgme-dev make libmagic jpeg-dev \
			zlib-dev libjpeg supervisor bash ffmpeg git \
                        libxml2-dev libxslt-dev
RUN mkdir -p /usr/src/environments/api_utils && mkdir /mnt/scrappers
WORKDIR /usr/src/environments/api_utils/
RUN git clone -b master https://github.com/muhbianco/APIUtils.git .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN if [ "$APP_ENV" = "dev" ]; then \
	cp .env.dev .env; \
     else \
	cp .env.prod .env; \
     fi
COPY .env.example .env
RUN chmod +x /usr/src/environments/api_utils/entrypoint.sh
ENTRYPOINT ["/usr/src/environments/api_utils/entrypoint.sh"]
