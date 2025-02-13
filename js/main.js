document.addEventListener('DOMContentLoaded', () => {
    const pageInput = document.getElementById('page-input');
    const display = document.getElementById('teletext-display');

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
                renderPage(page);
            });
    }

    function renderPage(page) {
        display.innerHTML = '';
        page.forEach(row => {
            row.forEach(sixel => {
                const cell = document.createElement('div');
                cell.className = 'sixel';
                cell.style.backgroundColor = sixel.color;
                cell.textContent = sixel.char;
                display.appendChild(cell);
            });
        });
    }

    loadPage('100'); // Load default page
});