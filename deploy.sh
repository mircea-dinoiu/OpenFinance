echo '- Pulling latest master...'
git pull origin master
echo '- Installing missing node_modules...'
yarn
echo '- Building React App...'
yarn build
echo '- Deploying to EBS...'
eb deploy
