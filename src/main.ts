import { getInput, setOutput, setFailed } from '@actions/core';
import replaceSpecialCharacters from './replace';
import grep from './grep';

/**
 * The main function for the action.
 * @returns {void} Resolves when the action is complete.
 */
export function run(): void {
  try {
    const title: string = getInput('issue_title');
    const body: string = getInput('issue_body');

    const author: string[] | null = grep(body, '^author=.+$');
    const date: string[] | null = grep(
      body,
      '^date=[0-9]{4}[-/.][0-9]{1,2}[-/.][0-9]{1,2}$'
    );

    const authorName: string = author ? author[0].split('=')[1] : '';

    let dateFormatted = '';
    if (date) {
      const dateValue: string = date[0].split('=')[1];
      const dateParts: string[] = dateValue.split(/[-/.]/);
      dateFormatted = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
    }

    let bodyWithoutComments: string = body;
    let previousBody: string;
    do {
      previousBody = bodyWithoutComments;
      bodyWithoutComments = bodyWithoutComments.replace(/<!--.*?-->/gs, '').trim();
    } while (bodyWithoutComments !== previousBody);
    const bodyWithHalfWidthExclamationMarks: string =
      bodyWithoutComments.replace(/！/g, '!'); // Replace full-width exclamation marks with half-width exclamation marks to avoid font related issues

    setOutput('title', replaceSpecialCharacters(title));
    setOutput('date', dateFormatted);
    setOutput('author', replaceSpecialCharacters(authorName));
    setOutput(
      'body',
      replaceSpecialCharacters(bodyWithHalfWidthExclamationMarks)
    );
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}
