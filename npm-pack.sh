#!/bin/bash

set -ex

_REPO_NAME="${TRAVIS_REPO_SLUG#*/}"
_VER="${TRAVIS_TAG/#v/}"
_UPSTREAM_VER="${_VER/%-gentoo/}"
_SRC_DIR="$(pwd)"
sed -i -e 's/"version":.*/"version": "'"${_UPSTREAM_VER}"'",/g' package.json
npm pack
mkdir /tmp/${_REPO_NAME}-${_UPSTREAM_VER}
cd /tmp/${_REPO_NAME}-${_UPSTREAM_VER} && npm install "${_SRC_DIR}/${_REPO_NAME}-${_UPSTREAM_VER}.tgz" && rm -f .bin
cd /tmp && tar czf "${_SRC_DIR}/${_REPO_NAME}-build.tar.gz" ${_REPO_NAME}-${_UPSTREAM_VER} && cd "${_SRC_DIR}"
