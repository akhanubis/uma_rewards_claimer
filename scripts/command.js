const argv = require('yargs').argv
const execSync = require('child_process').execSync
execSync('npm run compile',  { stdio: 'inherit' })
execSync(argv.command, { stdio: 'inherit' })