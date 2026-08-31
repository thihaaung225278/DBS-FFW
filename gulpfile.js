'use strict';

const path = require('path');
const build = require('@microsoft/sp-build-web');

/** OPC Part URI-safe segment — App Catalog rejects spaces and reserved chars in ClientSideAssets. */
function sanitizeOpcPartName(name) {
  return name
    .replace(/[\s&',()]+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'asset';
}

function opcSafeOutputFilename(pathData, prefix) {
  const resource = (pathData.module && pathData.module.resource) || pathData.filename || '';
  const base = path.basename(resource, path.extname(resource));
  return prefix + sanitizeOpcPartName(base) + '_[contenthash][ext]';
}

function patchOpcSafeAssetRules(rules) {
  if (!rules) {
    return;
  }

  for (const rule of rules) {
    if (rule.oneOf) {
      patchOpcSafeAssetRules(rule.oneOf);
    }

    if (rule.generator && rule.generator.filename === '[name]_[contenthash][ext]') {
      rule.generator.filename = (pathData) => opcSafeOutputFilename(pathData, '');
    }
  }
}

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    patchOpcSafeAssetRules(generatedConfiguration.module && generatedConfiguration.module.rules);

    generatedConfiguration.module.rules.unshift({
      test: /\.ics$/i,
      type: 'asset/resource',
      generator: {
        filename: (pathData) => opcSafeOutputFilename(pathData, 'ffw2023-ical-')
      }
    });

    generatedConfiguration.module.rules.unshift({
      test: /\.ico$/i,
      type: 'asset/resource',
      generator: {
        filename: (pathData) => opcSafeOutputFilename(pathData, 'ffw-favicon-')
      }
    });

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));

// After initialize so this replaces the gulp-era list (no webp) from SPWebBuildRig.
build.copyStaticAssets.setConfig({
  includeExtensions: ['jpg', 'png', 'woff', 'woff2', 'eot', 'ttf', 'svg', 'gif', 'dds', 'resx', 'webp', 'ics', 'json', 'ico']
});
