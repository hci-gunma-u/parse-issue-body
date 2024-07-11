/**
 * Searches for a pattern in a string and returns the lines that contain the pattern.
 * @param {string} input String to search for the pattern.
 * @param {string} pattern Regular expression pattern to search for in the input.
 * @returns
 */
export default function grep(input: string, pattern: string): string[] | null {
  const regex = new RegExp(pattern)
  const inputLines: string[] = input.split(/\r\n|\n|\r/)
  const matches: string[] = inputLines.filter(line => {
    return line.match(regex) === null ? false : true
  })
  return matches.length > 0 ? matches : null
}
