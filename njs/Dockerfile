FROM nginx

WORKDIR /app
COPY . /app

RUN ln -sf /app/njs/nginx.conf /etc/nginx/nginx.conf && \
    mkdir /etc/nginx/njs && \
    ln -sf /app/njs/*.js /etc/nginx/njs