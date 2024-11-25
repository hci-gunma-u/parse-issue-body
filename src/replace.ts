type SpecialCharacters = Record<string, string>;

/**
 * Replaces special characters(double and single quote, dollar) in a string with their HTML entity equivalents.
 * @param {string} str The string to replace special characters in.
 * @returns {string} The string with special characters replaced.
 */
export default function replaceSpecialCharacters(str: string): string {
  // Define the special characters and their replacements
  const specialCharacters: SpecialCharacters = {
    '"': '&quot;',
    "'": '&#39;',
    $: '&#36;'
  };

  // Replace the special characters in the string
  return str.replace(/["'$]/g, match => specialCharacters[match]);
}
