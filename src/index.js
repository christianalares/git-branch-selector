#!/usr/bin/env node
import simpleGit from 'simple-git'
import inquirer from 'inquirer'
import inquirerPrompt from 'inquirer-autocomplete-prompt'
import fuzzy from 'fuzzy'
import chalk from 'chalk'
import { exec } from 'child_process'

inquirer.registerPrompt('autocomplete', inquirerPrompt)

const thisFolder = process.cwd()

const checkoutBranch = branchName => {
  return new Promise((resolve, reject) => {
    exec(`git checkout ${branchName}`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve(stderr)
      }
    })
  })
}

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

const [, , initialSearchTermArg] = process.argv

git.branchLocal(async (_commands, output) => {
  if (!output) {
    console.log(`😕 This folder ${chalk.italic(`(${thisFolder})`)} is not a git repository.`)
    process.exit(1)
  }

  if (initialSearchTermArg) {
    const initialResults = fuzzy.filter(initialSearchTermArg, output.all).map(searchHit => searchHit.string)

    if (initialResults.length === 1) {
      try {
        const checkoutCommandOutput = await checkoutBranch(initialResults[0])
        console.log(checkoutCommandOutput)
        process.exit(0)
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    }
  }

  process.stdin.on('keypress', handleKeyDown)
  const searchBranch = (answers, input = initialSearchTermArg ?? '') => {
    return new Promise(resolve => {
      resolve(
        fuzzy.filter(input, output.all).map((el, i) => ({
          name: `${i + 1}) ${output.current === el.original ? `${el.original} 👈` : el.original}`,
          value: el.original,
          short: el.original,
        }))
      )
    })
  }

  const answer = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'branch',
      source: searchBranch,
      pageSize: 20,
      message: 'Choose branch:',
      default: output.current,
    },
  ])

  try {
    const checkoutCommandOutput = await checkoutBranch(answer.branch)
    console.log(checkoutCommandOutput)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})