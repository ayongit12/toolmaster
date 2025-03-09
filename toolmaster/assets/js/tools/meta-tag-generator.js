document.addEventListener('DOMContentLoaded', () => {
    const metaForm = document.getElementById('metaForm');
    const resultContainer = document.getElementById('resultContainer');
    const generatedCode = document.getElementById('generatedCode');
    const copyBtn = document.getElementById('copyBtn');

    metaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('pageTitle').value;
        const description = document.getElementById('description').value;
        const keywords = document.getElementById('keywords').value;
        const author = document.getElementById('author').value;
        const viewport = document.getElementById('viewport').value;
        const robots = document.getElementById('robots').value;

        let metaTags = `<title>${escapeHtml(title)}</title>\n`;
        metaTags += `<meta charset="UTF-8">\n`;
        metaTags += `<meta name="viewport" content="${viewport}">\n`;
        
        if (description) {
            metaTags += `<meta name="description" content="${escapeHtml(description)}">\n`;
        }
        
        if (keywords) {
            metaTags += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
        }
        
        if (author) {
            metaTags += `<meta name="author" content="${escapeHtml(author)}">\n`;
        }
        
        metaTags += `<meta name="robots" content="${robots}">\n`;

        // Open Graph tags
        metaTags += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
        if (description) {
            metaTags += `<meta property="og:description" content="${escapeHtml(description)}">\n`;
        }
        metaTags += `<meta property="og:type" content="website">\n`;

        // Twitter Card tags
        metaTags += `<meta name="twitter:card" content="summary">\n`;
        metaTags += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
        if (description) {
            metaTags += `<meta name="twitter:description" content="${escapeHtml(description)}">\n`;
        }

        generatedCode.value = metaTags;
        resultContainer.classList.remove('d-none');
    });

    copyBtn.addEventListener('click', () => {
        generatedCode.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    });

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}); 