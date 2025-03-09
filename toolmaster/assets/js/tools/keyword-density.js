document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            content: document.getElementById('contentInput'),
            phraseLength: document.getElementById('phraseLength'),
            minOccurrences: document.getElementById('minOccurrences'),
            excludeCommon: document.getElementById('excludeCommon'),
            caseSensitive: document.getElementById('caseSensitive')
        },
        displays: {
            totalWords: document.getElementById('totalWords'),
            uniqueWords: document.getElementById('uniqueWords'),
            avgWordLength: document.getElementById('avgWordLength'),
            resultsTable: document.getElementById('resultsTable'),
            densityChart: document.getElementById('densityChart')
        },
        buttons: {
            analyze: document.getElementById('analyzeBtn'),
            clear: document.getElementById('clearBtn'),
            exportCsv: document.getElementById('exportCsv'),
            exportJson: document.getElementById('exportJson'),
            copyResults: document.getElementById('copyResults')
        }
    };

    // Common words to exclude
    const commonWords = new Set([
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
        'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
        'to', 'was', 'were', 'will', 'with'
    ]);

    // Chart instance
    let densityChart = null;

    // Analysis results
    let analysisResults = null;

    // Initialize
    initializeEventListeners();

    function initializeEventListeners() {
        elements.buttons.analyze.addEventListener('click', analyzeContent);
        elements.buttons.clear.addEventListener('click', clearContent);
        elements.buttons.exportCsv.addEventListener('click', exportToCsv);
        elements.buttons.exportJson.addEventListener('click', exportToJson);
        elements.buttons.copyResults.addEventListener('click', copyResults);

        // Auto-analyze on settings change
        Object.values(elements.inputs).forEach(input => {
            input.addEventListener('change', analyzeContent);
        });
    }

    function analyzeContent() {
        const content = elements.inputs.content.value.trim();
        if (!content) {
            alert('Please enter some content to analyze');
            return;
        }

        const settings = {
            phraseLength: parseInt(elements.inputs.phraseLength.value),
            minOccurrences: parseInt(elements.inputs.minOccurrences.value),
            excludeCommon: elements.inputs.excludeCommon.checked,
            caseSensitive: elements.inputs.caseSensitive.checked
        };

        const analysis = performAnalysis(content, settings);
        displayResults(analysis);
        analysisResults = analysis;
    }

    function performAnalysis(content, settings) {
        // Prepare content
        let processedContent = settings.caseSensitive ? content : content.toLowerCase();
        const words = processedContent.split(/\s+/).filter(word => word.length > 0);
        
        // Basic statistics
        const stats = {
            totalWords: words.length,
            uniqueWords: new Set(words).size,
            avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
        };

        // Analyze phrases
        const phrases = {};
        const locations = {};

        for (let i = 0; i <= words.length - settings.phraseLength; i++) {
            const phrase = words.slice(i, i + settings.phraseLength).join(' ');
            
            // Skip common words if enabled
            if (settings.excludeCommon && settings.phraseLength === 1 && commonWords.has(phrase)) {
                continue;
            }

            phrases[phrase] = (phrases[phrase] || 0) + 1;
            
            if (!locations[phrase]) {
                locations[phrase] = [];
            }
            locations[phrase].push(i + 1);
        }

        // Filter and sort results
        const results = Object.entries(phrases)
            .filter(([_, count]) => count >= settings.minOccurrences)
            .map(([phrase, count]) => ({
                phrase,
                count,
                density: (count / stats.totalWords * 100).toFixed(2),
                locations: locations[phrase]
            }))
            .sort((a, b) => b.count - a.count);

        return { stats, results };
    }

    function displayResults(analysis) {
        // Update statistics
        elements.displays.totalWords.textContent = analysis.stats.totalWords;
        elements.displays.uniqueWords.textContent = analysis.stats.uniqueWords;
        elements.displays.avgWordLength.textContent = analysis.stats.avgWordLength.toFixed(1);

        // Update results table
        elements.displays.resultsTable.innerHTML = analysis.results.map(result => `
            <tr>
                <td>${escapeHtml(result.phrase)}</td>
                <td>${result.count}</td>
                <td>${result.density}%</td>
                <td>${result.locations.join(', ')}</td>
            </tr>`).join('');

        // Update density chart
        if (densityChart) {
            densityChart.destroy();
        }
        densityChart = new Chart(elements.displays.densityChart, {
            type: 'bar',
            data: {
                labels: analysis.results.map(result => result.phrase),
                datasets: [{
                    label: 'Density',
                    data: analysis.results.map(result => parseFloat(result.density)),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function clearContent() {
        elements.inputs.content.value = '';
        elements.displays.totalWords.textContent = '0';
        elements.displays.uniqueWords.textContent = '0';
        elements.displays.avgWordLength.textContent = '0.0';
        elements.displays.resultsTable.innerHTML = '';
        if (densityChart) {
            densityChart.destroy();
        }
    }

    function exportToCsv() {
        // Implementation of exportToCsv function
    }

    function exportToJson() {
        // Implementation of exportToJson function
    }

    function copyResults() {
        // Implementation of copyResults function
    }
}); 