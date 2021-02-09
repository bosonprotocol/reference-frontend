echo "Branch name:"
read branch
git checkout -b ${branch}
git push --set-upstream https://github.com/bosonprotocol/reference-frontend ${branch}