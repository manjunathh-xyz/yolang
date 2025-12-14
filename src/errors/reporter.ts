export function reportError(error: Error, source: string) {
  const message = error.message;
  const match = message.match(/at line (\d+), column (\d+)/);
  if (!match) {
    console.error(`❌ Error: ${message}`);
    return;
  }
  const lineNum = parseInt(match[1]);
  const col = parseInt(match[2]);
  const lines = source.split('\n');
  const line = lines[lineNum - 1];
  console.error(`❌ Error on line ${lineNum}`);
  console.error(`  ${line}`);
  console.error(`  ${' '.repeat(col - 1)}^`);
  // Add hints if possible
  if (message.includes('Expected =')) {
    console.error('Hint: Use "=" for assignment, not "=="');
  } else if (message.includes('Undefined variable')) {
    console.error('Hint: Make sure the variable is defined before use');
  }
}