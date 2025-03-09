document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            url: document.getElementById('urlInput')
        },
        buttons: {
            analyze: document.getElementById('analyzeBtn'),
            downloadReport: document.getElementById('downloadReportBtn'),
            shareResults: document.getElementById('shareResultsBtn'),
            expandAll: document.getElementById('expandAllBtn'),
            collapseAll: document.getElementById('collapseAllBtn'),
            copyShareLink: document.getElementById('copyShareLinkBtn'),
            twitterShare: document.getElementById('twitterShareBtn'),
            linkedinShare: document.getElementById('linkedinShareBtn')
        },
        displays: {
            loading: document.getElementById('loadingIndicator'),
            results: document.getElementById('resultsContainer'),
            progress: document.querySelector('.progress-bar'),
            mobileScore: document.getElementById('mobileScore'),
            desktopScore: document.getElementById('desktopScore'),
            mobileScoreLabel: document.getElementById('mobileScoreLabel'),
            desktopScoreLabel: document.getElementById('desktopScoreLabel'),
            lcpValue: document.getElementById('lcpValue'),
            fidValue: document.getElementById('fidValue'),
            clsValue: document.getElementById('clsValue'),
            lcpInfo: document.getElementById('lcpInfo'),
            fidInfo: document.getElementById('fidInfo'),
            clsInfo: document.getElementById('clsInfo'),
            metricsTable: document.getElementById('metricsTable'),
            optimizations: document.getElementById('optimizationAccordion'),
            shareLink: document.getElementById('shareLink')
        },
        charts: {
            resourceTypes: document.getElementById('resourceTypesChart'),
            resourceSizes: document.getElementById('resourceSizesChart')
        }
    };

    // Charts instances
    let resourceTypesChart = null;
    let resourceSizesChart = null;

    // Initialize
    initializePageSpeedChecker();

    function initializePageSpeedChecker() {
        // Add event listeners
        elements.buttons.analyze.addEventListener('click', startAnalysis);
        elements.buttons.downloadReport.addEventListener('click', downloadReport);
        elements.buttons.shareResults.addEventListener('click', showShareModal);
        elements.buttons.expandAll.addEventListener('click', expandAllOptimizations);
        elements.buttons.collapseAll.addEventListener('click', collapseAllOptimizations);
        elements.buttons.copyShareLink.addEventListener('click', copyShareLink);
        elements.buttons.twitterShare.addEventListener('click', shareOnTwitter);
        elements.buttons.linkedinShare.addEventListener('click', shareOnLinkedIn);

        // Enter key support
        elements.inputs.url.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') startAnalysis();
        });

        // Check for shared results in URL
        checkForSharedResults();
    }

    async function startAnalysis() {
        const url = elements.inputs.url.value.trim();
        if (!isValidUrl(url)) {
            showError('Please enter a valid URL');
            return;
        }

        showLoading(true);
        try {
            const results = await analyzeUrl(url);
            displayResults(results);
        } catch (error) {
            showError('Failed to analyze URL: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    async function analyzeUrl(url) {
        // Simulate API call with progress updates
        // In a real implementation, this would call Google PageSpeed Insights API
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                updateProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(generateSampleResults());
                }
            }, 500);
        });
    }

    function generateSampleResults() {
        return {
            mobile: {
                score: 75,
                metrics: {
                    lcp: 2.5,
                    fid: 80,
                    cls: 0.12
                }
            },
            desktop: {
                score: 85,
                metrics: {
                    lcp: 1.8,
                    fid: 50,
                    cls: 0.08
                }
            },
            resources: {
                types: {
                    'HTML': 50,
                    'JavaScript': 250,
                    'CSS': 100,
                    'Images': 500,
                    'Fonts': 150,
                    'Other': 50
                },
                sizes: {
                    'Under 10KB': 15,
                    '10KB - 100KB': 25,
                    '100KB - 500KB': 8,
                    'Over 500KB': 2
                }
            },
            optimizations: [
                {
                    title: 'Optimize Images',
                    impact: 'High',
                    description: 'Properly size and compress images to reduce load time.',
                    details: [
                        'image1.jpg could be reduced by 50%',
                        'image2.png should be converted to WebP'
                    ]
                },
                {
                    title: 'Minimize JavaScript',
                    impact: 'Medium',
                    description: 'Reduce unused JavaScript and defer non-critical scripts.',
                    details: [
                        'Remove unused JavaScript code',
                        'Defer loading of third-party scripts'
                    ]
                }
            ]
        };
    }

    function displayResults(results) {
        // Update scores
        updateScores(results.mobile.score, results.desktop.score);

        // Update Core Web Vitals
        updateCoreWebVitals(results.mobile.metrics);

        // Update metrics table
        updateMetricsTable(results.mobile.metrics);

        // Update optimization suggestions
        updateOptimizations(results.optimizations);

        // Update resource charts
        updateResourceCharts(results.resources);

        // Show results container
        elements.displays.results.style.display = 'block';
    }

    function updateScores(mobileScore, desktopScore) {
        // Update score displays
        elements.displays.mobileScore.textContent = mobileScore;
        elements.displays.desktopScore.textContent = desktopScore;

        // Update score colors and labels
        updateScoreDisplay('mobile', mobileScore);
        updateScoreDisplay('desktop', desktopScore);
    }

    function updateScoreDisplay(type, score) {
        const scoreElement = elements.displays[`${type}Score`].parentElement;
        const labelElement = elements.displays[`${type}ScoreLabel`];

        // Set color based on score
        let color, label;
        if (score >= 90) {
            color = '#0cce6b';
            label = 'Excellent';
        } else if (score >= 50) {
            color = '#ffa400';
            label = 'Moderate';
        } else {
            color = '#ff4e42';
            label = 'Poor';
        }

        scoreElement.style.borderColor = color;
        labelElement.textContent = label;
        labelElement.style.color = color;
    }

    function updateCoreWebVitals(metrics) {
        // Update LCP
        elements.displays.lcpValue.textContent = `${metrics.lcp.toFixed(1)} s`;
        updateMetricStatus('lcp', metrics.lcp, [2.5, 4.0]);

        // Update FID
        elements.displays.fidValue.textContent = `${metrics.fid.toFixed(0)} ms`;
        updateMetricStatus('fid', metrics.fid, [100, 300]);

        // Update CLS
        elements.displays.clsValue.textContent = metrics.cls.toFixed(2);
        updateMetricStatus('cls', metrics.cls, [0.1, 0.25]);
    }

    function updateMetricStatus(metric, value, thresholds) {
        const infoElement = elements.displays[`${metric}Info`];
        let status, color;

        if (value <= thresholds[0]) {
            status = 'Good';
            color = '#0cce6b';
        } else if (value <= thresholds[1]) {
            status = 'Needs Improvement';
            color = '#ffa400';
        } else {
            status = 'Poor';
            color = '#ff4e42';
        }

        infoElement.textContent = status;
        infoElement.style.color = color;
    }

    function updateMetricsTable(metrics) {
        const metricsData = [
            { name: 'First Contentful Paint', value: '1.2s', target: '< 2s' },
            { name: 'Time to Interactive', value: '3.5s', target: '< 5s' },
            { name: 'Total Blocking Time', value: '150ms', target: '< 300ms' },
            { name: 'Speed Index', value: '2.8s', target: '< 4s' }
        ];

        elements.displays.metricsTable.innerHTML = metricsData.map(metric => `
            <tr>
                <td>${metric.name}</td>
                <td>${metric.value}</td>
                <td>
                    <span class="status-badge status-good">
                        Target: ${metric.target}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    function updateOptimizations(optimizations) {
        elements.displays.optimizations.innerHTML = optimizations.map((opt, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#optimization${index}">
                        ${opt.title}
                        <span class="badge bg-primary ms-2">${opt.impact}</span>
                    </button>
                </h2>
                <div id="optimization${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <p>${opt.description}</p>
                        <ul>
                            ${opt.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function updateResourceCharts(resources) {
        // Destroy existing charts
        if (resourceTypesChart) resourceTypesChart.destroy();
        if (resourceSizesChart) resourceSizesChart.destroy();

        // Create resource types chart
        resourceTypesChart = new Chart(elements.charts.resourceTypes, {
            type: 'pie',
            data: {
                labels: Object.keys(resources.types),
                datasets: [{
                    data: Object.values(resources.types),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56',
                        '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Resource Types Distribution'
                    }
                }
            }
        });

        // Create resource sizes chart
        resourceSizesChart = new Chart(elements.charts.resourceSizes, {
            type: 'bar',
            data: {
                labels: Object.keys(resources.sizes),
                datasets: [{
                    label: 'Number of Resources',
                    data: Object.values(resources.sizes),
                    backgroundColor: '#36A2EB'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Resource Sizes Distribution'
                    }
                }
            }
        });
    }

    function showLoading(show) {
        elements.displays.loading.style.display = show ? 'block' : 'none';
        elements.buttons.analyze.disabled = show;
    }

    function updateProgress(progress) {
        elements.displays.progress.style.width = `${progress}%`;
    }

    function downloadReport() {
        // Generate report content
        const reportContent = generateReportContent();
        
        // Create and download file
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page-speed-report-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generateReportContent() {
        // Implementation for generating detailed report content
        return 'Page Speed Analysis Report\n' + 
               '========================\n' +
               `URL: ${elements.inputs.url.value}\n` +
               `Date: ${new Date().toLocaleString()}\n\n` +
               `Mobile Score: ${elements.displays.mobileScore.textContent}\n` +
               `Desktop Score: ${elements.displays.desktopScore.textContent}\n`;
    }

    function showShareModal() {
        const shareUrl = generateShareUrl();
        elements.displays.shareLink.value = shareUrl;
        new bootstrap.Modal(document.getElementById('shareModal')).show();
    }

    function generateShareUrl() {
        const url = new URL(window.location.href);
        url.searchParams.set('url', elements.inputs.url.value);
        return url.toString();
    }

    function copyShareLink() {
        navigator.clipboard.writeText(elements.displays.shareLink.value)
            .then(() => showCopyFeedback(elements.buttons.copyShareLink));
    }

    function shareOnTwitter() {
        const text = `Check out the performance analysis of ${elements.inputs.url.value}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    function shareOnLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(elements.inputs.url.value)}`;
        window.open(url, '_blank');
    }

    function expandAllOptimizations() {
        document.querySelectorAll('.accordion-collapse').forEach(collapse => {
            collapse.classList.add('show');
        });
    }

    function collapseAllOptimizations() {
        document.querySelectorAll('.accordion-collapse').forEach(collapse => {
            collapse.classList.remove('show');
        });
    }

    function checkForSharedResults() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedUrl = urlParams.get('url');
        if (sharedUrl) {
            elements.inputs.url.value = sharedUrl;
            startAnalysis();
        }
    }

    function showError(message) {
        alert(message); // Replace with better error handling
    }

    function showCopyFeedback(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }
}); 