module.exports = {
  default: [
    '--format progress-bar',
    '--format json:cucumber-report.json',
    '--require features/support/world.js',
    '--require features/step_definitions/**/*.js',
    '--require-module chai',
    'features/**/*.feature'
  ].join(' ')
};
