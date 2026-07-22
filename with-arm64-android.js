const { createRunOncePlugin, withAppBuildGradle } = require('@expo/config-plugins');

const ABI_SPLIT = `
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "arm64-v8a"
        }
    }
`;

function withArm64Android(config) {
  return withAppBuildGradle(config, cfg => {
    if (!cfg.modResults.contents.includes('include "arm64-v8a"')) {
      cfg.modResults.contents = cfg.modResults.contents.replace('android {', `android {${ABI_SPLIT}`);
    }
    return cfg;
  });
}

module.exports = createRunOncePlugin(withArm64Android, 'with-arm64-android', '1.0.0');
