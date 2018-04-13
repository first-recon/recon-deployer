echo "moving dirs"
cd recon-app
echo "rebasing"
git pull --rebase
echo "installing deps"
yarn install
echo "building artifact"
npm run build:android
