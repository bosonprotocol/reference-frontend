#!/usr/bin/env bash

[ -n "$TRACE" ] && set -x
set -e
set -o pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../../.." && pwd )"

cd "$PROJECT_DIR"

echo "$GPG_KEY" | gpg --import -
git crypt unlock

mkdir build
aws sts assume-role \
    --role-arn "${PROVISIONING_ROLE_ARN}" \
    --role-session-name CI \
    > build/session

export AWS_ACCESS_KEY_ID="$(jq -M -r .Credentials.AccessKeyId build/session)"
export AWS_SECRET_ACCESS_KEY="$(jq -M -r .Credentials.SecretAccessKey build/session)"
export AWS_SESSION_TOKEN="$(jq -M -r .Credentials.SessionToken build/session)"

./go "app:deploy[${DEPLOYMENT_TYPE},${DEPLOYMENT_LABEL}]"
