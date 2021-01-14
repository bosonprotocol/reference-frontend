echo "Branch name:"
read branch
git checkout -b ${branch}
git push --set-upstream origin ${branch}