#!/usr/bin/env bash

yarn build-storybook
mkdir package
mv ./(.*|*) package 2>/dev/null || :
mv ./package/storybook-static ./
# rm -fr package