#!/usr/bin/env node
import simpleGit from 'simple-git'
import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import fuzzy from 'fuzzy'
import chalk from 'chalk'
import { exec } from 'child_process'

inquirer.registerPrompt('autocomplete', inquirerPrompt)

const thisFolder = process.cwd()

const handleKeyDown = (_ch, key) => {
  if (!key) {
    return
  }

  if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
    process.exit()
  }
}

const git = simpleGit({
  baseDir: thisFolder,
})

git.branchLocal(async (_commands, output) => {
  if (!output) {
    console.log(`😕 This folder ${chalk.italic(`(${thisFolder})`)} is not a git repository.`)
    process.exit(0)
  }

  process.stdin.on('keypress', handleKeyDown)

  const searchBranch = (answers, input = '') => {
    return new Promise(resolve => {
      resolve(fuzzy.filter(input, output.all).map((el, i) => `${i + 1}) ${el.original}`))
    })
  }

  const answer = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'branch',
      source: searchBranch,
      pageSize: 20,
      message: 'Choose branch:',
      default: '',
    },
  ])

  exec(`git checkout ${answer.branch}`, (err, stdout, stderr) => {
    if (err) {
      console.log(stderr)
      process.exit(1)
    }

    console.log(stdout, stderr)
    process.exit(0)
  })
})
