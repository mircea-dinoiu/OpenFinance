# Build with npm
npm run build

# Build desktop version
pushd sources/desktop
pushd resources
compass compile
popd
sencha app build
popd