const simpleGit = require('simple-git')
const inquirer = require('inquirer')
const { exec } = require('child_process')

const git = simpleGit({
  baseDir: process.cwd(),
})

git.branchLocal(async (_commands, output) => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'branch',
      message: 'Choose branch:',
      default: '3',
      choices: output.all,
      default: output.current,
    },
  ])

  exec(`git checkout ${answer.branch}`, (err, stdout, stderr) => {
    if (err) {
      console.log(stderr)
      process.exit(0)
    }

    console.log(stdout, stderr)
    process.exit(0)
  })
})
