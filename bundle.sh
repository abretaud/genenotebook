#!/usr/bin/env bash

set -eox pipefail

VERSION=$(jq -r '.version' package.json)

BUNDLE_NAME="genenotebook_v$VERSION"

if [ -d $BUNDLE_NAME ]
then
  echo "Removing existing folder $BUNDLE_NAME"
  rm -rf $BUNDLE_NAME
fi

meteor build $BUNDLE_NAME --server-only --directory 
mv $BUNDLE_NAME/bundle/* $BUNDLE_NAME 
pushd $BUNDLE_NAME/programs/server
ls -l
jq . package.json
npm install
popd 
pushd scripts
npm install
popd 
cp -r scripts/* $BUNDLE_NAME 
jq ".version = $(jq .version package.json)" scripts/package.json > \
  $BUNDLE_NAME/package.json
cp -r testdata.tgz $BUNDLE_NAME 
cp -r LICENSE $BUNDLE_NAME 