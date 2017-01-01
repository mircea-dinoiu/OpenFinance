#!/usr/bin/env bash
# Build with npm
npm install
npm run build:prod

# Build desktop version
pushd sources/desktop
pushd resources
compass compile
popd
sencha app build
popd