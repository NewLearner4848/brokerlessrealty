#!/bin/bash

git pull origin main
npm install
pm2 restart backend
pm2 save
