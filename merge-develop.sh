echo "Merge to branch:"
read branch
git checkout develop
git pull origin develop
git checkout ${branch}
git merge develop