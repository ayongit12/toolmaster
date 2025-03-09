document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            pageTitle: document.getElementById('pageTitle'),
            metaDescription: document.getElementById('metaDescription'),
            keywords: document.getElementById('keywords'),
            author: document.getElementById('author'),
            socialTitle: document.getElementById('socialTitle'),
            socialDescription: document.getElementById('socialDescription'),
            imageUrl: document.getElementById('imageUrl'),
            siteName: document.getElementById('siteName'),
            robotIndex: document.getElementById('robotIndex'),
            robotFollow: document.getElementById('robotFollow'),
            viewport: document.getElementById('viewport'),
            language: document.getElementById('language'),
            canonical: document.getElementById('canonical')
        },
        counters: {
            titleLength: document.getElementById('titleLength'),
            descriptionLength: document.getElementById('descriptionLength')
        },
        buttons: {
            generate: document.getElementById('generateBtn'),
            copy: document.getElementById('copyBtn')
        },
        output: {
            code: document.getElementById('generatedCode'),
            searchPreview: document.getElementById('searchPreview'),
            socialPreview: document.getElementById('socialPreview')
        }
    };

    // Initialize
    initializeEventListeners();
    updateCharacterCounters();

    function initializeEventListeners() {
        // Character count updates
        elements.inputs.pageTitle.addEventListener('input', () => {
            updateCharacterCount('pageTitle', 'titleLength', 60);
            updatePreviews();
        });

        elements.inputs.metaDescription.addEventListener('input', () => {
            updateCharacterCount('metaDescription', 'descriptionLength', 160);
            updatePreviews();
        });

        // Preview updates
        Object.values(elements.inputs).forEach(input => {
            if (input) {
                input.addEventListener('input', updatePreviews);
            }
        });

        // Button actions
        elements.buttons.generate.addEventListener('click', generateMetaTags);
        elements.buttons.copy.addEventListener('click', copyToClipboard);
    }

    function updateCharacterCounters() {
        updateCharacterCount('pageTitle', 'titleLength', 60);
        updateCharacterCount('metaDescription', 'descriptionLength', 160);
    }

    function updateCharacterCount(inputId, counterId, limit) {
        const input = elements.inputs[inputId];
        const counter = elements.counters[counterId];
        const length = input.value.length;
        
        counter.textContent = length;
        counter.className = length > limit ? 'text-danger' : 'text-muted';
    }

    function generateMetaTags() {
        const data = collectFormData();
        const code = generateCode(data);
        elements.output.code.textContent = code;
        updatePreviews();
    }

    function collectFormData() {
        return {
            title: elements.inputs.pageTitle.value.trim(),
            description: elements.inputs.metaDescription.value.trim(),
            keywords: elements.inputs.keywords.value.trim(),
            author: elements.inputs.author.value.trim(),
            socialTitle: elements.inputs.socialTitle.value.trim(),
            socialDescription: elements.inputs.socialDescription.value.trim(),
            imageUrl: elements.inputs.imageUrl.value.trim(),
            siteName: elements.inputs.siteName.value.trim(),
            robots: {
                index: elements.inputs.robotIndex.checked,
                follow: elements.inputs.robotFollow.checked
            },
            viewport: elements.inputs.viewport.value,
            language: elements.inputs.language.value.trim(),
            canonical: elements.inputs.canonical.value.trim()
        };
    }

    function generateCode(data) {
        let code = '';

        // Basic meta tags
        code += `<title>${escapeHtml(data.title)}</title>\n`;
        code += `<meta charset="UTF-8">\n`;
        
        if (data.description) {
            code += `<meta name="description" content="${escapeHtml(data.description)}">\n`;
        }
        
        if (data.keywords) {
            code += `<meta name="keywords" content="${escapeHtml(data.keywords)}">\n`;
        }
        
        if (data.author) {
            code += `<meta name="author" content="${escapeHtml(data.author)}">\n`;
        }

        // Robots
        const robotsValue = [];
        robotsValue.push(data.robots.index ? 'index' : 'noindex');
        robotsValue.push(data.robots.follow ? 'follow' : 'nofollow');
        code += `<meta name="robots" content="${robotsValue.join(', ')}">\n`;

        // Viewport
        switch (data.viewport) {
            case 'responsive':
                code += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
                break;
            case 'fixed':
                code += `<meta name="viewport" content="width=1024">\n`;
                break;
            case 'custom':
                code += `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n`;
                break;
        }

        // Language
        if (data.language) {
            code += `<meta http-equiv="content-language" content="${escapeHtml(data.language)}">\n`;
        }

        // Canonical
        if (data.canonical) {
            code += `<link rel="canonical" href="${escapeHtml(data.canonical)}">\n`;
        }

        // Open Graph tags
        if (data.socialTitle || data.title) {
            code += `<meta property="og:title" content="${escapeHtml(data.socialTitle || data.title)}">\n`;
        }
        
        if (data.socialDescription || data.description) {
            code += `<meta property="og:description" content="${escapeHtml(data.socialDescription || data.description)}">\n`;
        }
        
        if (data.imageUrl) {
            code += `<meta property="og:image" content="${escapeHtml(data.imageUrl)}">\n`;
        }
        
        if (data.siteName) {
            code += `<meta property="og:site_name" content="${escapeHtml(data.siteName)}">\n`;
        }

        // Twitter Card tags
        code += `<meta name="twitter:card" content="summary_large_image">\n`;
        if (data.socialTitle || data.title) {
            code += `<meta name="twitter:title" content="${escapeHtml(data.socialTitle || data.title)}">\n`;
        }
        
        if (data.socialDescription || data.description) {
            code += `<meta name="twitter:description" content="${escapeHtml(data.socialDescription || data.description)}">\n`;
        }
        
        if (data.imageUrl) {
            code += `<meta name="twitter:image" content="${escapeHtml(data.imageUrl)}">\n`;
        }

        return code;
    }

    function updatePreviews() {
        const data = collectFormData();
        
        // Update search preview
        const searchPreview = elements.output.searchPreview;
        searchPreview.querySelector('.preview-title').textContent = data.title;
        searchPreview.querySelector('.preview-url').textContent = window.location.href;
        searchPreview.querySelector('.preview-description').textContent = data.description;
        
        // Update social preview
        const socialPreview = elements.output.socialPreview;
        socialPreview.querySelector('.social-title').textContent = data.socialTitle || data.title;
        socialPreview.querySelector('.social-description').textContent = data.socialDescription || data.description;
        socialPreview.querySelector('.social-image').style.backgroundImage = `url(${data.imageUrl})`;
        socialPreview.querySelector('.social-domain').textContent = window.location.hostname;
    }

    function copyToClipboard() {
        const code = elements.output.code.textContent;
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        elements.buttons.copy.textContent = 'Copied!';
        setTimeout(() => {
            elements.buttons.copy.textContent = 'Copy';
        }, 2000);
    }
}); 