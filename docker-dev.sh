#!/bin/bash
docker build --progress=plain --no-cache -t deno-nestjs-setup .
# docker run -p 3000:3000 deno-nestjs-setup