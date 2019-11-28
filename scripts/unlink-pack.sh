#!/usr/bin/env bash

PACK_NAME="use-node-promise-pack"

cd ../${PACK_NAME}/package
yarn unlink
cd ../..
rm -fr ${PACK_NAME}
