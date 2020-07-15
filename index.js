const simpleGit = require('simple-git')

const git = simpleGit({
  baseDir: process.cwd(),
})

console.log(git.branch())
