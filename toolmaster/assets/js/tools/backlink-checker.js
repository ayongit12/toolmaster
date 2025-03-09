document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const domainInput = document.getElementById('domainInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    const scheduleConfirmBtn = document.getElementById('scheduleConfirmBtn');

    // Initialize DataTables
    const backlinksTable = $('#backlinksTable').DataTable({
        pageLength: 10,
        order: [[1, 'desc']],
        columns: [
            { data: 'sourceUrl' },
            { data: 'domainAuthority' },
            { data: 'anchorText' },
            { data: 'linkType' },
            { data: 'firstSeen' },
            { data: 'status' }
        ]
    });

    // Charts initialization
    let linkTypesChart, anchorTextChart, historicalChart;

    // Event Listeners
    analyzeBtn.addEventListener('click', startAnalysis);
    exportCsvBtn.addEventListener('click', () => exportData('csv'));
    exportExcelBtn.addEventListener('click', () => exportData('excel'));
    downloadReportBtn.addEventListener('click', downloadFullReport);
    scheduleBtn.addEventListener('click', () => scheduleModal.show());
    scheduleConfirmBtn.addEventListener('click', scheduleReport);

    // Main analysis function
    async function startAnalysis() {
        const domain = domainInput.value.trim();
        if (!isValidDomain(domain)) {
            showAlert('Please enter a valid domain name', 'danger');
            return;
        }

        showLoading(true);
        try {
            const data = await analyzeBacklinks(domain);
            displayResults(data);
        } catch (error) {
            showAlert('Error analyzing backlinks: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Validate domain format
    function isValidDomain(domain) {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    // Simulate backlink analysis (replace with actual API call)
    async function analyzeBacklinks(domain) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Return mock data
        return {
            totalBacklinks: 1547,
            uniqueDomains: 324,
            domainAuthority: 45,
            linkTypes: {
                follow: 892,
                nofollow: 655
            },
            anchorText: {
                'Brand Name': 423,
                'Generic': 312,
                'Target Keywords': 289,
                'URL': 245,
                'Others': 278
            },
            backlinks: generateMockBacklinks(),
            topDomains: generateMockTopDomains(),
            historicalData: generateMockHistoricalData()
        };
    }

    // Display analysis results
    function displayResults(data) {
        resultsContainer.style.display = 'block';
        
        // Update statistics
        document.getElementById('totalBacklinks').textContent = data.totalBacklinks;
        document.getElementById('uniqueDomains').textContent = data.uniqueDomains;
        document.getElementById('domainAuthority').textContent = data.domainAuthority;

        // Update charts
        updateCharts(data);

        // Update tables
        updateBacklinksTable(data.backlinks);
        updateTopDomainsTable(data.topDomains);
        updateAnchorTextTable(data.anchorText);
    }

    // Update visualization charts
    function updateCharts(data) {
        // Link Types Chart
        if (linkTypesChart) linkTypesChart.destroy();
        linkTypesChart = new Chart(document.getElementById('linkTypesChart'), {
            type: 'pie',
            data: {
                labels: ['Follow', 'Nofollow'],
                datasets: [{
                    data: [data.linkTypes.follow, data.linkTypes.nofollow],
                    backgroundColor: ['#0d6efd', '#ffc107']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Link Types Distribution'
                    }
                }
            }
        });

        // Anchor Text Chart
        if (anchorTextChart) anchorTextChart.destroy();
        anchorTextChart = new Chart(document.getElementById('anchorTextChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(data.anchorText),
                datasets: [{
                    label: 'Occurrences',
                    data: Object.values(data.anchorText),
                    backgroundColor: '#0d6efd'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Anchor Text Distribution'
                    }
                }
            }
        });

        // Historical Chart
        if (historicalChart) historicalChart.destroy();
        historicalChart = new Chart(document.getElementById('historicalChart'), {
            type: 'line',
            data: {
                labels: data.historicalData.map(d => d.date),
                datasets: [{
                    label: 'Total Backlinks',
                    data: data.historicalData.map(d => d.count),
                    borderColor: '#0d6efd',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Backlinks Growth Over Time'
                    }
                }
            }
        });
    }

    // Export data function
    function exportData(format) {
        const filename = `backlinks-report-${new Date().toISOString().split('T')[0]}`;
        if (format === 'csv') {
            // Implement CSV export
            const csvContent = generateCSV();
            downloadFile(csvContent, `${filename}.csv`, 'text/csv');
        } else {
            // Implement Excel export
            const excelContent = generateExcel();
            downloadFile(excelContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }
    }

    // Download full report
    function downloadFullReport() {
        // Implement PDF report generation
        const reportContent = generatePDFReport();
        const filename = `backlink-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
        downloadFile(reportContent, filename, 'application/pdf');
    }

    // Schedule report
    function scheduleReport() {
        const frequency = document.getElementById('reportFrequency').value;
        const email = document.getElementById('reportEmail').value;

        if (!email || !isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'danger');
            return;
        }

        // Implement report scheduling logic here
        showAlert('Report scheduled successfully!', 'success');
        scheduleModal.hide();
    }

    // Utility functions
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
        analyzeBtn.disabled = show;
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.tool-container').insertBefore(alertDiv, loadingIndicator);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Mock data generators
    function generateMockBacklinks() {
        // Generate mock backlink data
        return Array.from({ length: 50 }, (_, i) => ({
            sourceUrl: `https://example${i}.com/page`,
            domainAuthority: Math.floor(Math.random() * 100),
            anchorText: `Anchor Text ${i}`,
            linkType: Math.random() > 0.5 ? 'Follow' : 'Nofollow',
            firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: Math.random() > 0.1 ? 'Active' : 'Broken'
        }));
    }

    function generateMockTopDomains() {
        // Generate mock top domains data
        return Array.from({ length: 10 }, (_, i) => ({
            domain: `domain${i}.com`,
            backlinks: Math.floor(Math.random() * 100),
            authority: Math.floor(Math.random() * 100),
            traffic: Math.floor(Math.random() * 10000)
        }));
    }

    function generateMockHistoricalData() {
        // Generate mock historical data
        const dates = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }).reverse();

        return dates.map(date => ({
            date,
            count: Math.floor(Math.random() * 1000 + 500)
        }));
    }
}); 