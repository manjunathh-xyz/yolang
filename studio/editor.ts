// Kexra Studio Editor
let runtime: any;

const examples: { [key: string]: string } = {
  hello: `say "Hello, Kexra!"

set name = "World"
say "Hello, " + name + "!"

set age = 25
say "Age: " + age`,
  functions: `fn greet(name) {
  say "Hello, " + name + "!"
}

greet("Alice")
greet("Bob")`,
  loops: `for i in 1..5 {
  say i
}

set count = 0
loop count < 3 {
  say "Count: " + count
  set count = count + 1
}`
};

function initRuntime() {
  // Mock runtime for MVP
  runtime = {
    eval: function(code: string) {
      try {
        // Simple mock - in real implementation, use compiled Kexra runtime
        if (code.includes('say')) {
          return { success: true, value: 'Output: Hello from Kexra!' };
        }
        return { success: true, value: 'Code executed successfully' };
      } catch (e) {
        return { success: false, error: 'Runtime error' };
      }
    }
  };
}

function runCode() {
  const editor = document.getElementById('editor') as HTMLTextAreaElement;
  const code = editor.value;
  const result = runtime.eval(code);
  const output = document.getElementById('output')!;
  if (result.success) {
    output.textContent = result.value;
  } else {
    output.textContent = 'Error: ' + result.error;
  }
}

function loadExample() {
  const select = document.getElementById('examples') as HTMLSelectElement;
  const example = examples[select.value];
  if (example) {
    const editor = document.getElementById('editor') as HTMLTextAreaElement;
    editor.value = example;
  }
}

function initREPL() {
  const replInput = document.getElementById('repl-input') as HTMLInputElement;
  replInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const code = replInput.value;
      const result = runtime.eval(code);
      const output = document.getElementById('output')!;
      output.textContent += '\n> ' + code + '\n' + (result.success ? result.value : 'Error: ' + result.error);
      replInput.value = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initRuntime();
  initREPL();

  const runBtn = document.getElementById('run-btn')!;
  runBtn.addEventListener('click', runCode);

  const examplesSelect = document.getElementById('examples')!;
  examplesSelect.addEventListener('change', loadExample);
});