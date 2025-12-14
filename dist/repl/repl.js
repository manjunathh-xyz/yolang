"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRepl = void 0;
const readline = __importStar(require("readline"));
const tokenize_1 = require("../lexer/tokenize");
const parse_1 = require("../parser/parse");
const interpreter_1 = require("../runtime/interpreter");
const reporter_1 = require("../errors/reporter");
const KexraError_1 = require("../errors/KexraError");
function startRepl() {
    console.log(`🎧 Kexra REPL v${require('../../package.json').version}`);
    console.log('Type \'help\' for commands, \'exit\' to quit');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'yo> '
    });
    const interpreter = new interpreter_1.Interpreter();
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
            const vars = interpreter.getEnv();
            if (Object.keys(vars).length === 0) {
                console.log('No variables defined.');
            }
            else {
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
        try {
            const tokens = (0, tokenize_1.tokenize)(multiline.trim());
            const program = (0, parse_1.parse)(tokens);
            interpreter.interpret(program);
        }
        catch (error) {
            if (error instanceof KexraError_1.KexraError) {
                (0, reporter_1.reportError)(error, multiline.trim());
            }
            else {
                console.error('Unexpected error:', error);
            }
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
exports.startRepl = startRepl;
