/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('出力値チェック1', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'issue_body':
          return '<!--\nauthor=John Doe\ndate=2021-01-01\n-->\n\nThis is the body of the issue.'
        case 'issue_title':
          return 'タイトル'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'title', 'タイトル')
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'date', '2021-01-01')
    expect(setOutputMock).toHaveBeenNthCalledWith(3, 'author', 'John Doe')
    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'body',
      'This is the body of the issue.'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('出力値チェック2', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'issue_body':
          return "<!--\nauthor='John Doe'\ndate=2021/01/01\n-->\n\nThis is the body of the issue."
        case 'issue_title':
          return 'タイトル'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'title', 'タイトル')
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'date', '2021-01-01')
    expect(setOutputMock).toHaveBeenNthCalledWith(
      3,
      'author',
      '&#39;John Doe&#39;'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'body',
      'This is the body of the issue.'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('出力値チェック3', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'issue_body':
          return '<!--\nauthor=John Doe\ndate=2021.01.01\n-->\n\nThis is the body of the issue.\nHello, world!\n""\nTEXT'
        case 'issue_title':
          return 'タイトル'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'title', 'タイトル')
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'date', '2021-01-01')
    expect(setOutputMock).toHaveBeenNthCalledWith(3, 'author', 'John Doe')
    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'body',
      'This is the body of the issue.\nHello, world!\n&quot;&quot;\nTEXT'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('出力値チェック4', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'issue_body':
          return '<!--\nauthor=John Doe\ndate=2021.1.1\n-->\n\nThis is the body of the issue.\nHello, world!\n""\nTEXT'
        case 'issue_title':
          return 'タイトル'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'title', 'タイトル')
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'date', '2021-01-01')
    expect(setOutputMock).toHaveBeenNthCalledWith(3, 'author', 'John Doe')
    expect(setOutputMock).toHaveBeenNthCalledWith(
      4,
      'body',
      'This is the body of the issue.\nHello, world!\n&quot;&quot;\nTEXT'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
