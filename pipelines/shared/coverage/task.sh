#!/usr/bin/env bash

[ -n "$TRACE" ] && set -x
set -e
set -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../../.." && pwd )"

cd "$PROJECT_DIR"

export INCLUDE_COVERAGE="true"

./go "test"
./go "tests:coverage:badge"

git config --global user.email "ci@redeemeum.com"
git config --global user.name "Redeemeum CI"
git add .
git diff --staged --quiet || git commit -m "Update coverage badge [ci skip]"
