#!/usr/bin/env bash

PACK_NAME="use-promise-element-pack"

cd ../${PACK_NAME}/package
yarn unlink
cd ../..
rm -fr ${PACK_NAME}
