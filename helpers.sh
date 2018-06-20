#!/bin/sh
#
# ldconfig -p | grep pcap 查看类库是否安装
# 
# command -v foo >/dev/null 2>&1 || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }
# bash
# type foo >/dev/null 2>&1 || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }
# hash foo 2>/dev/null || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }

set -e

# s="a b c"

# set -- $s
# echo $1
# echo $2
# echo $3

# yarn update
# export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
# dos2unix 转换unix格式换行

yarn_update() {

	command -v curl >/dev/null 2>&1 || { apk add --no-cache curl; }
	command -v bash >/dev/null 2>&1 || { apk add --no-cache bash; }

	yarnBin=/usr/local/bin/yarn
	yarnpkgBin=/usr/local/bin/yarnpkg
	yarnPackage=latest.tar.gz

	cd /opt
	rm $yarnBin $yarnpkgBin
	rm -rf yarn*
	wget https://nightly.yarnpkg.com/$yarnPackage
	tar zvxf $yarnPackage && rm $yarnPackage
	ln -s /opt/yarn*/bin/yarn $yarnBin
	ln -s /opt/yarn*/bin/yarnpkg $yarnpkgBin

	# gnupg 
	# wget -qO- https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --import
	# wget https://yarnpkg.com/${yarnPackage}.asc
	# gpg --verify ${yarnPackage}.asc

	# curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --nightly
	# rm $yarnBin $yarnpkgBin
	# ln -s $HOME/.yarn/bin/yarn $yarnBin
	# ln -s $HOME/.yarn/bin/yarnpkg $yarnpkgBin
}


if [[ $1 == "yarn_update" ]]; then
	yarn_update
fi