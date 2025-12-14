// Kexra Studio Editor
var runtime;
var examples = {
    hello: "say \"Hello, Kexra!\"\n\nset name = \"World\"\nsay \"Hello, \" + name + \"!\"\n\nset age = 25\nsay \"Age: \" + age",
    functions: "fn greet(name) {\n  say \"Hello, \" + name + \"!\"\n}\n\ngreet(\"Alice\")\ngreet(\"Bob\")",
    loops: "for i in 1..5 {\n  say i\n}\n\nset count = 0\nloop count < 3 {\n  say \"Count: \" + count\n  set count = count + 1\n}"
};
function initRuntime() {
    // Mock runtime for MVP
    runtime = {
        eval: function (code) {
            try {
                // Simple mock - in real implementation, use compiled Kexra runtime
                if (code.includes('say')) {
                    return { success: true, value: 'Output: Hello from Kexra!' };
                }
                return { success: true, value: 'Code executed successfully' };
            }
            catch (e) {
                return { success: false, error: 'Runtime error' };
            }
        }
    };
}
function runCode() {
    var editor = document.getElementById('editor');
    var code = editor.value;
    var result = runtime.eval(code);
    var output = document.getElementById('output');
    if (result.success) {
        output.textContent = result.value;
    }
    else {
        output.textContent = 'Error: ' + result.error;
    }
}
function loadExample() {
    var select = document.getElementById('examples');
    var example = examples[select.value];
    if (example) {
        var editor = document.getElementById('editor');
        editor.value = example;
    }
}
function initREPL() {
    var replInput = document.getElementById('repl-input');
    replInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            var code = replInput.value;
            var result = runtime.eval(code);
            var output = document.getElementById('output');
            output.textContent += '\n> ' + code + '\n' + (result.success ? result.value : 'Error: ' + result.error);
            replInput.value = '';
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    initRuntime();
    initREPL();
    var runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click', runCode);
    var examplesSelect = document.getElementById('examples');
    examplesSelect.addEventListener('change', loadExample);
});
