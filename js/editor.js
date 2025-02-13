document.addEventListener('DOMContentLoaded', () => {
    const pageInput = document.getElementById('page-input');
    const editor = document.getElementById('teletext-editor');
    const jsonOutput = document.getElementById('json-output');
    const updateJsonButton = document.getElementById('update-json');

    const colors = ['white', 'red', 'yellow', 'green', 'cyan', 'darkblue'];
    let currentColorIndex = 0;

    pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadPage(pageInput.value);
        }
    });

    updateJsonButton.addEventListener('click', updateJsonOutput);

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
                const sixel = (page[i] && page[i][j]) || { char: '', color: 'white' };
                cell.style.color = sixel.color;
                cell.textContent = sixel.char;
                cell.contentEditable = true;
                cell.addEventListener('click', () => toggleColor(cell));
                cell.addEventListener('input', () => updateJsonOutput());
                editor.appendChild(cell);
            }
        }
        updateJsonOutput();
    }

    function toggleColor(cell) {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        cell.style.color = colors[currentColorIndex];
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
                    color: cell.style.color
                });
            }
            rows.push(row);
        }
        jsonOutput.value = JSON.stringify({ pages: { [pageInput.value]: rows } }, null, 2);
    }

    loadPage('100'); // Load default page
});