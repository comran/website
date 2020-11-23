#!/bin/bash

# Ensure that the current working directory is at the root (where this script is located).
cd "$(dirname "$0")"

# Build static website.
yarn run build

# Deploy to AWS.
aws s3 sync --exclude deploy.sh --delete $(pwd)/dist s3://comran.org/
aws cloudfront create-invalidation --distribution-id ERSO2C8EXRBGS --paths "/*"
