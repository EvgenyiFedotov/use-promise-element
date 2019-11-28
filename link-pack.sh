#!/usr/bin/env bash

FILE_NAME="package-pack.tgz"
PACK_NAME="use-node-promise-pack"

yarn pack --filename ${FILE_NAME}
mkdir -pv ../${PACK_NAME}
tar -xvzf ${FILE_NAME} -C ../${PACK_NAME}
rm ${FILE_NAME}
cd ../${PACK_NAME}/package
yarn link
