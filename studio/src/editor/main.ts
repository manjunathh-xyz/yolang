import { BrowserRuntime } from '../runtime-bridge';
import { OutputPanel } from '../panels/output';
import { ErrorsPanel } from '../panels/errors';
import { TracePanel } from '../panels/trace';
import { ReplPanel } from '../panels/repl';
import { SidebarExplorer } from '../sidebar/explorer';
import { CommandPalette } from '../commands/palette';

declare const monaco: any;

let runtime: BrowserRuntime;
let editor: any;
let outputPanel: OutputPanel;
let errorsPanel: ErrorsPanel;
let tracePanel: TracePanel;
let replPanel: ReplPanel;
let commandPalette: CommandPalette;

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
}`,
  'error-handling': `try {
  set x = 10 / 0
} catch err {
  say "Error: " + err
} finally {
  say "Cleanup done"
}`,
  'advanced': `const PI = 3.14159

fn circle_area(radius) {
  return PI * radius * radius
}

set area = circle_area(5)
say "Area: " + area

# Optional chaining
set user = { name: "Alice", profile: { age: 30 } }
say user?.profile?.age

# Ternary
set status = area > 50 ? "large" : "small"
say "Circle is " + status`
};

function initMonaco() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
  require(['vs/editor/editor.main'], function() {
    monaco.languages.register({ id: 'kexra' });
    monaco.languages.setMonarchTokensProvider('kexra', {
      tokenizer: {
        root: [
          [/\b(say|set|const|check|else|loop|fn|return|true|false|and|or|not|for|in|break|continue|try|catch|finally|switch|case|default)\b/, 'keyword'],
          [/\b\d+\.\d+|\d+/, 'number'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          [/[{}()[\]]/, '@brackets'],
          [/[+\-*/><=?:!]/, 'operator'],
        ],
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ]
      }
    });

    const savedTheme = localStorage.getItem('kexra-theme') || 'vs-dark';
    const savedCode = localStorage.getItem('kexra-code') || examples.hello;

    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: savedCode,
      language: 'kexra',
      theme: savedTheme,
      fontSize: 14,
      minimap: { enabled: false },
      lineNumbers: 'on',
      bracketMatching: 'always',
      autoIndent: 'full',
      folding: true,
    });

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Virtual save
      console.log('Saved (virtual)');
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      const selection = editor.getSelection();
      const model = editor.getModel();
      const line = model.getLineContent(selection.startLineNumber);
      const newLine = line.startsWith('#') ? line.substring(1) : '#' + line;
      model.setValue(
        model.getValue().replace(line, newLine)
      );
    });

    // Auto-save
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      localStorage.setItem('kexra-code', code);
    });
  });
}

function initRuntime() {
  runtime = new BrowserRuntime({ trace: false });
}

function initPanels() {
  const bottomContainer = document.getElementById('bottom-panels')!;
  outputPanel = new OutputPanel(bottomContainer);
  errorsPanel = new ErrorsPanel(bottomContainer);
  tracePanel = new TracePanel(bottomContainer);

  // Panel switching
  const tabs = document.querySelectorAll('.panel-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = (tab as HTMLElement).dataset.panel;
      showPanel(panel!);
    });
  });

  const replContainer = document.getElementById('repl-container')!;
  replPanel = new ReplPanel(replContainer, (cmd) => {
    const result = runtime.eval(cmd);
    if (result.output) outputPanel.append(`> ${cmd}\n${result.output}`);
    if (result.error) errorsPanel.append(result.error);
  });
}

function showPanel(panelName: string) {
  const panels = document.querySelectorAll('.panel-content');
  panels.forEach(p => (p as HTMLElement).style.display = 'none');
  const activePanel = document.getElementById(`${panelName}-panel`);
  if (activePanel) activePanel.style.display = 'block';
}

function initSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container')!;
  new SidebarExplorer(sidebarContainer, examples, (name, code) => {
    if (editor) {
      editor.setValue(code);
    }
  });
}

function initCommandPalette() {
  commandPalette = new CommandPalette();

  commandPalette.addCommand('Run File', runCode);
  commandPalette.addCommand('Reset Runtime', reset);
  commandPalette.addCommand('Clear Output', () => {
    outputPanel.clear();
    errorsPanel.clear();
    tracePanel.clear();
  });
  commandPalette.addCommand('Switch Theme', switchTheme);
  commandPalette.addCommand('Open Docs', () => {
    window.open('https://kexra.js.org/docs', '_blank');
  });
  commandPalette.addCommand('Save to Local', saveToLocal);
  commandPalette.addCommand('Load from Local', loadFromLocal);
  commandPalette.addCommand('Clear Local Save', clearLocalSave);
}

function runCode() {
  if (!editor) return;
  const code = editor.getValue();
  const result = runtime.eval(code);

  outputPanel.setContent(result.output || '');
  errorsPanel.setContent(result.error ? [result.error] : []);
  tracePanel.setContent(runtime.getTraces());
}

function reset() {
  runtime.reset();
  outputPanel.clear();
  errorsPanel.clear();
  tracePanel.clear();
}

function switchTheme() {
  if (!editor) return;
  const currentTheme = editor._themeService._theme.themeName;
  const newTheme = currentTheme === 'vs-dark' ? 'vs' : 'vs-dark';
  monaco.editor.setTheme(newTheme);
  localStorage.setItem('kexra-theme', newTheme);
}

function saveToLocal() {
  if (!editor) return;
  const code = editor.getValue();
  localStorage.setItem('kexra-code', code);
  alert('Code saved to local storage!');
}

function loadFromLocal() {
  if (!editor) return;
  const code = localStorage.getItem('kexra-code');
  if (code) {
    editor.setValue(code);
  } else {
    alert('No saved code found.');
  }
}

function clearLocalSave() {
  localStorage.removeItem('kexra-code');
  alert('Local save cleared!');
}

document.addEventListener('DOMContentLoaded', function() {
  initRuntime();
  initMonaco();
  initPanels();
  initSidebar();
  initCommandPalette();

  // Toolbar buttons
  document.getElementById('run-btn')!.addEventListener('click', runCode);
  document.getElementById('reset-btn')!.addEventListener('click', reset);

  const toggleReplBtn = document.getElementById('toggle-repl-btn')!;
  const replPanel = document.getElementById('repl-container')!;
  const replSplitter = document.getElementById('repl-splitter')!;

  toggleReplBtn.addEventListener('click', () => {
    const isHidden = replPanel.style.display === 'none';
    if (isHidden) {
      replPanel.style.display = 'flex';
      replSplitter.style.display = 'block';
      toggleReplBtn.textContent = 'Hide REPL';
    } else {
      replPanel.style.display = 'none';
      replSplitter.style.display = 'none';
      toggleReplBtn.textContent = 'Show REPL';
    }
  });

  // Resizable splitter
  const splitter = document.getElementById('repl-splitter')!;
  let isResizing = false;

  splitter.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const replPanel = document.getElementById('repl-container') as HTMLElement;
    const container = document.querySelector('.bottom-area') as HTMLElement;
    const rect = container.getBoundingClientRect();
    const newWidth = Math.max(150, Math.min(600, rect.right - e.clientX));
    replPanel.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = '';
  });
});