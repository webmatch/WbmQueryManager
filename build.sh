#!/usr/bin/env bash

commit=$1
if [ -z ${commit} ]; then
    commit=$(git tag | tail -n 1)
    if [ -z ${commit} ]; then
        commit="master";
    fi
fi

# Remove old release
rm -rf WbmQueryManager WbmQueryManager-*.zip

# Build new release
mkdir -p WbmQueryManager
git archive ${commit} | tar -x -C WbmQueryManager
composer install --no-dev -n -o -d WbmQueryManager
zip -r WbmQueryManager-${commit}.zip WbmQueryManager