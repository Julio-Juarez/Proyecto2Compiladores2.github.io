/*function updateLineNumbers() {
    const textarea = document.getElementById('editor');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = textarea.value.split('\n').length;
    
    lineNumbers.innerHTML = '';
    
    for (let i = 1; i <= lines; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateLineNumbers();

    const textarea = document.getElementById('textarea');
    textarea.addEventListener('scroll', function () {
        const lineNumbers = document.getElementById('lineNumbers');
        lineNumbers.scrollTop = textarea.scrollTop;
    });
});

*/