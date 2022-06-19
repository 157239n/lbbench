#!/bin/bash

apt-get update
apt-get install -y git vim curl apache2-utils parallel
curl vim.kelvinho.org | bash 
curl -sL https://deb.nodesource.com/setup_18.x | bash -
apt-get update && apt-get install nodejs -y
curl -L get.docker.com | bash
docker network create main

