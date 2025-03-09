document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            websiteUrl: document.getElementById('websiteUrl'),
            defaultChangefreq: document.getElementById('defaultChangefreq'),
            defaultPriority: document.getElementById('defaultPriority'),
            includeLastmod: document.getElementById('includeLastmod'),
            prettyPrint: document.getElementById('prettyPrint'),
            importUrls: document.getElementById('importUrls')
        },
        containers: {
            urlEntries: document.getElementById('urlEntries'),
            generatedCode: document.getElementById('generatedCode')
        },
        buttons: {
            addUrl: document.getElementById('addUrlBtn'),
            importUrls: document.getElementById('importUrlsBtn'),
            importConfirm: document.getElementById('importConfirmBtn'),
            generate: document.getElementById('generateBtn'),
            copy: document.getElementById('copyBtn'),
            download: document.getElementById('downloadBtn')
        },
        modal: {
            import: new bootstrap.Modal(document.getElementById('importModal'))
        }
    };

    // Initialize
    initializeEventListeners();
    addUrlEntry(); // Add first entry by default

    function initializeEventListeners() {
        elements.buttons.addUrl.addEventListener('click', addUrlEntry);
        elements.buttons.importUrls.addEventListener('click', () => elements.modal.import.show());
        elements.buttons.importConfirm.addEventListener('click', importUrls);
        elements.buttons.generate.addEventListener('click', generateSitemap);
        elements.buttons.copy.addEventListener('click', copyToClipboard);
        elements.buttons.download.addEventListener('click', downloadSitemap);

        // Auto-update base URL in entries when website URL changes
        elements.inputs.websiteUrl.addEventListener('input', updateBaseUrls);
    }

    function addUrlEntry(url = '', changefreq = '', priority = '') {
        const entryId = Date.now();
        const baseUrl = elements.inputs.websiteUrl.value.trim();
        
        const entryHtml = `
            <div class="url-entry mb-3" data-entry-id="${entryId}">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-12 mb-2">
                                <div class="input-group">
                                    <span class="input-group-text base-url">${baseUrl || 'https://'}</span>
                                    <input type="text" class="form-control url-path" 
                                           placeholder="path/to/page" value="${url}">
                                    <button class="btn btn-outline-danger delete-url">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-sm-6 col-lg-4 mb-2">
                                <select class="form-select changefreq">
                                    <option value="">Change Frequency</option>
                                    <option value="always" ${changefreq === 'always' ? 'selected' : ''}>Always</option>
                                    <option value="hourly" ${changefreq === 'hourly' ? 'selected' : ''}>Hourly</option>
                                    <option value="daily" ${changefreq === 'daily' ? 'selected' : ''}>Daily</option>
                                    <option value="weekly" ${changefreq === 'weekly' ? 'selected' : ''}>Weekly</option>
                                    <option value="monthly" ${changefreq === 'monthly' ? 'selected' : ''}>Monthly</option>
                                    <option value="yearly" ${changefreq === 'yearly' ? 'selected' : ''}>Yearly</option>
                                    <option value="never" ${changefreq === 'never' ? 'selected' : ''}>Never</option>
                                </select>
                            </div>
                            <div class="col-sm-6 col-lg-4 mb-2">
                                <select class="form-select priority">
                                    <option value="">Priority</option>
                                    <option value="1.0" ${priority === '1.0' ? 'selected' : ''}>1.0</option>
                                    <option value="0.9" ${priority === '0.9' ? 'selected' : ''}>0.9</option>
                                    <option value="0.8" ${priority === '0.8' ? 'selected' : ''}>0.8</option>
                                    <option value="0.7" ${priority === '0.7' ? 'selected' : ''}>0.7</option>
                                    <option value="0.6" ${priority === '0.6' ? 'selected' : ''}>0.6</option>
                                    <option value="0.5" ${priority === '0.5' ? 'selected' : ''}>0.5</option>
                                    <option value="0.4" ${priority === '0.4' ? 'selected' : ''}>0.4</option>
                                    <option value="0.3" ${priority === '0.3' ? 'selected' : ''}>0.3</option>
                                    <option value="0.2" ${priority === '0.2' ? 'selected' : ''}>0.2</option>
                                    <option value="0.1" ${priority === '0.1' ? 'selected' : ''}>0.1</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        elements.containers.urlEntries.insertAdjacentHTML('beforeend', entryHtml);
    }

    function updateBaseUrls() {
        const urls = document.querySelectorAll('.url-path');
        urls.forEach(input => {
            const baseUrl = elements.inputs.websiteUrl.value.trim();
            input.value = input.value.replace(/^\//, '');
            input.value = baseUrl + input.value;
        });
    }

    function importUrls() {
        // Implementation of importUrls function
    }

    function generateSitemap() {
        // Implementation of generateSitemap function
    }

    function copyToClipboard() {
        // Implementation of copyToClipboard function
    }

    function downloadSitemap() {
        // Implementation of downloadSitemap function
    }
}); 