# syntax=docker/dockerfile:1
FROM ubuntu:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y git vim curl nginx && curl vim.kelvinho.org | bash 
RUN apt-get install -y haproxy rsyslog
EXPOSE 80 443
COPY haproxy.cfg /etc/haproxy/haproxy.cfg
COPY . .
CMD ["./startup"]
