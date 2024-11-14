FROM python:3.12.3-alpine
ARG ENV_FILE
RUN apk upgrade
RUN apk add gcc build-base python3-dev musl-dev \
			libc-dev libcurl curl-dev gpgme-dev make libmagic jpeg-dev \
			zlib-dev libjpeg supervisor bash ffmpeg git \
                        libxml2-dev libxslt-dev
RUN mkdir -p /usr/src/environments/api_etl
WORKDIR /usr/src/environments/api_etl/
# COPY ./requirements.txt .
# COPY $ENV_FILE .env
# COPY entrypoint.sh entrypoint.sh
# COPY /usr/src/environments/api_etl/* . -Rf
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# RUN chmod +x /usr/src/environments/api_etl/entrypoint.sh
# ENTRYPOINT ["/usr/src/environments/api_etl/entrypoint.sh"]
COPY . .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
