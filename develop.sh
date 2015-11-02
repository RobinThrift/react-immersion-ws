./node_modules/.bin/wr "node index.js" src templates &
./node_modules/.bin/browser-sync start --files "build/*, build/**/*" --server build;
