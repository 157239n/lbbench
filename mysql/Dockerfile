# syntax=docker/dockerfile:1
FROM ubuntu:latest 
ENV DEBIAN_FRONTEND noninteractive
WORKDIR /code
RUN apt-get update && apt-get install git curl vim iputils-ping htop -y && curl vim.kelvinho.org | bash
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && apt-get update && apt-get install nodejs -y
RUN apt-get install python3 imagemagick zip -y
RUN printf "\nexport PATH=$PATH:/code/node_modules/.bin">>/root/.bashrc
COPY app/.npmrc /root/.npmrc
EXPOSE 8000
CMD "/code/startup"

