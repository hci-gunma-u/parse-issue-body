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
      '^date=[0-9]{4}[-/.][0-9]{1,2}[-/.][0-9]{1,2}$'
    )

    const authorName: string = author ? author[0].split('=')[1] : ''

    let dateFormatted = ''
    if (date) {
      const dateValue: string = date[0].split('=')[1]
      const dateParts: string[] = dateValue.split(/[-/.]/)
      dateFormatted = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`
    }

    const bodyWithoutComments: string = body.replace(/<!--.*-->/gs, '').trim()
    const bodyWithHalfWidthExclamationMarks: string = bodyWithoutComments.replace(/！/g, '!') // Replace full-width exclamation marks with half-width exclamation marks to avoid font related issues

    core.setOutput('title', replaceSpecialCharacters(title))
    core.setOutput('date', dateFormatted)
    core.setOutput('author', replaceSpecialCharacters(authorName))
    core.setOutput('body', replaceSpecialCharacters(bodyWithHalfWidthExclamationMarks))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
