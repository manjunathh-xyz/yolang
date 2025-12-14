import * as readline from 'readline';
import { KexraRuntime } from '../runtime/runtime';
import { reportError } from '../errors/reporter';
import { KexraError } from '../errors/KexraError';

export function startRepl() {
  console.log(`🎧 Kexra REPL v${require('../../package.json').version}`);
  console.log('Type \'help\' for commands, \'exit\' to quit');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'yo> '
  });

  const runtime = new KexraRuntime();
  let multiline = '';

  rl.prompt();

  rl.on('line', (input) => {
    const trimmed = input.trim();
    if (trimmed === 'exit') {
      rl.close();
      return;
    }
    if (trimmed === 'help') {
      console.log('Built-in commands:');
      console.log('  exit  - Quit REPL');
      console.log('  help  - Show this help');
      console.log('  vars  - Show current variables');
      console.log('  clear - Clear terminal');
      rl.prompt();
      return;
    }
    if (trimmed === 'vars') {
      const vars = runtime.getEnv();
      if (Object.keys(vars).length === 0) {
        console.log('No variables defined.');
      } else {
        console.log('Variables:');
        for (const [key, value] of Object.entries(vars)) {
          console.log(`  ${key} = ${value}`);
        }
      }
      rl.prompt();
      return;
    }
    if (trimmed === 'clear') {
      console.clear();
      rl.prompt();
      return;
    }

    // Handle multiline
    multiline += input + '\n';
    const openBraces = (multiline.match(/{/g) || []).length;
    const closeBraces = (multiline.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
      rl.setPrompt('... ');
      rl.prompt();
      return;
    }

    // Process
    const result = runtime.eval(multiline.trim());
    if (!result.success) {
      console.error(`❌ Runtime Error`);
      console.error(result.error);
    }

    multiline = '';
    rl.setPrompt('yo> ');
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}