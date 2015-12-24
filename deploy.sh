# Build mobile
pushd sources/mobile
#sencha app build
popd

# Build desktop version
pushd sources/desktop
sencha app build
popd