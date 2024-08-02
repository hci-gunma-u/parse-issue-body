import grep from '../src/grep';

test('grep1', () => {
  const string = 'hello world\nhello\nworld';
  const pattern = 'hello';
  const result = grep(string, pattern);
  expect(result).toEqual(['hello world', 'hello']);
});

test('grep2', () => {
  const string =
    '<!--\nauthor=John Doe\ndate=2021-01-01\n-->\n\nThis is the body of the issue.';
  const pattern = '^author=.+$';
  const result = grep(string, pattern);
  expect(result).toEqual(['author=John Doe']);
});

test('grep3', () => {
  const string =
    '<!--\nauthor=John Doe\ndate=2021-01-01\n-->\n\nThis is the body of the issue.';
  const pattern = '^date=[0-9]{4}[-/.][0-9]{2}[-/.][0-9]{2}$';
  const result = grep(string, pattern);
  expect(result).toEqual(['date=2021-01-01']);
});
