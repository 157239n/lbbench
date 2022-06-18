#!/bin/bash

apt-get update
apt-get install -y git vim curl nginx apache2-utils && curl vim.kelvinho.org | bash 
curl get.docker.com | bash
docker network create main

