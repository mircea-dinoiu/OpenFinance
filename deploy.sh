# Build mobile
pushd sources/mobile
#sencha app build
popd

# Build desktop version
pushd sources/desktop
pushd resources
compass compile
popd
sencha app build
popd