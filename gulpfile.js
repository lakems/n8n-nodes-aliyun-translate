const { src, dest, series, parallel } = require('gulp');
const path = require('path');

function copyNodeIcons() {
  return src('nodes/**/icons/**')
    .pipe(dest('dist/nodes'));
}

function copyCredentialIcons() {
  return src('icons/**')
    .pipe(dest('dist/icons'));
}

exports['build:icons'] = parallel(
  copyNodeIcons,
  copyCredentialIcons
);