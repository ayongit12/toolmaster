document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('textInput');
    const clearBtn = document.getElementById('clearBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Initialize text composition chart
    let textCompositionChart;
    initializeChart();

    // Event Listeners
    textInput.addEventListener('input', debounce(analyzeText, 300));
    clearBtn.addEventListener('click', clearText);
    pasteBtn.addEventListener('click', pasteText);
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
    copyBtn.addEventListener('click', copyText);
    downloadBtn.addEventListener('click', downloadReport);

    // Main text analysis function
    function analyzeText() {
        const text = textInput.value;
        
        // Basic counts
        updateBasicCounts(text);
        
        // Reading time
        updateReadingTime(text);
        
        // Text statistics
        updateTextStatistics(text);
        
        // Keyword density
        updateKeywordDensity(text);
        
        // Readability scores
        updateReadabilityScores(text);
        
        // Text composition
        updateTextComposition(text);
    }

    // Basic counting functions
    function updateBasicCounts(text) {
        const words = text.trim() ? text.match(/\b\w+\b/g) || [] : [];
        const sentences = text.trim() ? text.match(/[.!?]+/g) || [] : [];
        const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(para => para.trim().length > 0) : [];

        document.getElementById('wordCount').textContent = words.length;
        document.getElementById('charCount').textContent = text.length;
        document.getElementById('sentenceCount').textContent = sentences.length;
        document.getElementById('paragraphCount').textContent = paragraphs.length;
    }

    // Reading time calculation
    function updateReadingTime(text) {
        const words = text.trim() ? text.match(/\b\w+\b/g) || [] : [];
        const wordCount = words.length;

        document.getElementById('slowReading').textContent = formatReadingTime(wordCount / 150);
        document.getElementById('avgReading').textContent = formatReadingTime(wordCount / 200);
        document.getElementById('fastReading').textContent = formatReadingTime(wordCount / 400);
    }

    // Text statistics analysis
    function updateTextStatistics(text) {
        const words = text.trim() ? text.match(/\b\w+\b/g) || [] : [];
        const uniqueWords = new Set(words.map(word => word.toLowerCase()));
        const avgLength = words.length ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
        const longestWord = words.length ? words.reduce((longest, current) => 
            current.length > longest.length ? current : longest, '') : '-';

        document.getElementById('uniqueWords').textContent = uniqueWords.size;
        document.getElementById('avgWordLength').textContent = avgLength.toFixed(1);
        document.getElementById('longestWord').textContent = longestWord;
    }

    // Keyword density analysis
    function updateKeywordDensity(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        const wordFrequency = {};

        // Count word frequency
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        // Sort by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        // Update table
        const tbody = document.querySelector('#keywordTable tbody');
        tbody.innerHTML = '';

        sortedWords.forEach(([word, count]) => {
            const density = (count / totalWords * 100).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${word}</td>
                <td>${count}</td>
                <td>${density}%</td>
                <td>
                    <div class="keyword-density-bar">
                        <div class="keyword-density-fill" style="width: ${density}%"></div>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Readability analysis
    function updateReadabilityScores(text) {
        const scores = calculateReadabilityScores(text);
        
        const fleschScore = document.getElementById('fleschScore');
        const fkGrade = document.getElementById('fkGrade');

        fleschScore.textContent = scores.fleschScore.toFixed(1);
        fleschScore.className = 'readability-score ' + getReadabilityClass(scores.fleschScore);

        fkGrade.textContent = scores.fkGrade.toFixed(1);
    }

    // Text composition analysis
    function updateTextComposition(text) {
        const composition = analyzeTextComposition(text);
        updateCompositionChart(composition);
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function formatReadingTime(minutes) {
        if (minutes < 1) {
            return 'Less than 1 min';
        }
        return `${Math.ceil(minutes)} min`;
    }

    function calculateReadabilityScores(text) {
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = text.match(/[.!?]+/g) || [];
        const syllables = countSyllables(text);

        const wordsPerSentence = words.length / (sentences.length || 1);
        const syllablesPerWord = syllables / (words.length || 1);

        const fleschScore = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
        const fkGrade = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;

        return {
            fleschScore: Math.max(0, Math.min(100, fleschScore)),
            fkGrade: Math.max(0, fkGrade)
        };
    }

    function countSyllables(text) {
        return text.toLowerCase()
            .replace(/[^a-z]/g, '')
            .replace(/[^aeiouy]*[aeiouy]+/g, 'a')
            .length;
    }

    function getReadabilityClass(score) {
        if (score >= 80) return 'good';
        if (score >= 60) return 'moderate';
        return 'poor';
    }

    function analyzeTextComposition(text) {
        const letters = text.match(/[a-zA-Z]/g) || [];
        const numbers = text.match(/[0-9]/g) || [];
        const spaces = text.match(/\s/g) || [];
        const punctuation = text.match(/[.,!?;:'"()\-]/g) || [];
        const special = text.match(/[^a-zA-Z0-9\s.,!?;:'"()\-]/g) || [];

        const total = text.length || 1;

        return {
            Letters: (letters.length / total * 100).toFixed(1),
            Numbers: (numbers.length / total * 100).toFixed(1),
            Spaces: (spaces.length / total * 100).toFixed(1),
            Punctuation: (punctuation.length / total * 100).toFixed(1),
            Special: (special.length / total * 100).toFixed(1)
        };
    }

    function initializeChart() {
        const ctx = document.getElementById('textComposition').getContext('2d');
        textCompositionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Letters', 'Numbers', 'Spaces', 'Punctuation', 'Special'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#0d6efd',
                        '#ffc107',
                        '#198754',
                        '#dc3545',
                        '#6c757d'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function updateCompositionChart(composition) {
        textCompositionChart.data.datasets[0].data = Object.values(composition);
        textCompositionChart.update();
    }

    // Action functions
    function clearText() {
        textInput.value = '';
        analyzeText();
    }

    async function pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            textInput.value = text;
            analyzeText();
        } catch (err) {
            alert('Failed to paste text. Please paste manually.');
        }
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            textInput.value = e.target.result;
            analyzeText();
        };
        reader.readAsText(file);
    }

    async function copyText() {
        try {
            await navigator.clipboard.writeText(textInput.value);
            showToast('Text copied to clipboard!');
        } catch (err) {
            alert('Failed to copy text. Please copy manually.');
        }
    }

    function downloadReport() {
        const text = textInput.value;
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = text.match(/[.!?]+/g) || [];
        const readability = calculateReadabilityScores(text);

        const report = `Word Count Analysis Report
Generated on: ${new Date().toLocaleString()}

Basic Statistics:
- Words: ${words.length}
- Characters: ${text.length}
- Sentences: ${sentences.length}
- Paragraphs: ${text.trim() ? text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length : 0}

Reading Time:
- Slow (150 wpm): ${formatReadingTime(words.length / 150)}
- Average (200 wpm): ${formatReadingTime(words.length / 200)}
- Fast (400 wpm): ${formatReadingTime(words.length / 400)}

Readability:
- Flesch Reading Ease: ${readability.fleschScore.toFixed(1)}
- Flesch-Kincaid Grade Level: ${readability.fkGrade.toFixed(1)}

Text Composition:
${Object.entries(analyzeTextComposition(text))
    .map(([key, value]) => `- ${key}: ${value}%`)
    .join('\n')}
`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'word-count-report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast show position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initial analysis
    analyzeText();
}); 