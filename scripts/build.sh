#!/usr/bin/env bash

if which yarn >/dev/null; then
    echo Yarn ready
else
    npm install -g yarn
fi

# Build with npm
yarn install
yarn run build:prod

# Build desktop version
pushd sources/desktop
pushd resources
compass compile
popd
sencha app build
popd

# Install npm prod
rm -rf node_modules
yarn install --production