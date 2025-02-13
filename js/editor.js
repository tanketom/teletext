document.addEventListener('DOMContentLoaded', () => {
    const pageInput = document.getElementById('page-input');
    const editor = document.getElementById('teletext-editor');
    const jsonOutput = document.getElementById('json-output');

    pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadPage(pageInput.value);
        }
    });

    function loadPage(pageNumber) {
        fetch('data/pages.json')
            .then(response => response.json())
            .then(data => {
                const page = data.pages[pageNumber] || data.pages['404'];
                renderEditor(page);
            });
    }

    function renderEditor(page) {
        editor.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            for (let j = 0; j < 40; j++) {
                const cell = document.createElement('div');
                cell.className = 'sixel';
                const sixel = (page[i] && page[i][j]) || { char: '', color: 'black' };
                cell.style.backgroundColor = sixel.color;
                cell.textContent = sixel.char;
                cell.contentEditable = true;
                cell.addEventListener('input', () => updateJsonOutput());
                editor.appendChild(cell);
            }
        }
        updateJsonOutput();
    }

    function updateJsonOutput() {
        const rows = [];
        const cells = editor.querySelectorAll('.sixel');
        for (let i = 0; i < 25; i++) {
            const row = [];
            for (let j = 0; j < 40; j++) {
                const cell = cells[i * 40 + j];
                row.push({
                    char: cell.textContent,
                    color: cell.style.backgroundColor
                });
            }
            rows.push(row);
        }
        jsonOutput.value = JSON.stringify({ pages: { [pageInput.value]: rows } }, null, 2);
    }

    loadPage('100'); // Load default page
});