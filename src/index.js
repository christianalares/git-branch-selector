#!/usr/bin/env node
const simpleGit = require('simple-git')
const inquirer = require('inquirer')
const chalk = require('chalk')
const { exec } = require('child_process')

const thisFolder = process.cwd()

const git = simpleGit({
  baseDir: thisFolder,
})

git.branchLocal(async (_commands, output) => {
  if (!output) {
    console.log(`😕 This folder (${thisFolder}) is not a git repository.`)
    process.exit(0)
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'branch',
      message: 'Choose branch:',
      choices: output.all.map(b =>
        b === output.current ? `${b} ${chalk.italic('(current)')}` : b
      ),
      default: output.all.indexOf(output.current),
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
