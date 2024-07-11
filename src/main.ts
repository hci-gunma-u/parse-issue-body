import * as core from '@actions/core'
import replaceSpecialCharacters from './replace'
import grep from './grep'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const title: string = core.getInput('issue_title')
    const body: string = core.getInput('issue_body')

    const author: string[] | null = grep(body, '^author=.+$')
    const date: string[] | null = grep(
      body,
      '^date=[0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2}$'
    )

    const authorString: string = author ? author[0] : ''
    const dateString: string = date ? date[0] : ''

    core.debug(`Author: ${authorString}`)
    core.debug(`Date: ${dateString}`)

    const authorName: string = authorString.split('=')[1]
    const dateValue: string = dateString.split('=')[1].replaceAll('/[/.]/', '-')

    const bodyWithoutComments: string = body.replace(/<!--.*-->/gs, '').trim()

    core.setOutput('title', replaceSpecialCharacters(title))
    core.setOutput('date', dateValue)
    core.setOutput('author', replaceSpecialCharacters(authorName))
    core.setOutput('body', replaceSpecialCharacters(bodyWithoutComments))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
