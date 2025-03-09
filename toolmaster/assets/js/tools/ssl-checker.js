document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        domainInput: document.getElementById('domainInput'),
        checkBtn: document.getElementById('checkBtn'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        resultContainer: document.getElementById('resultContainer'),
        statusBadge: document.getElementById('statusBadge'),
        domainName: document.getElementById('domainName'),
        issuer: document.getElementById('issuer'),
        validFrom: document.getElementById('validFrom'),
        validUntil: document.getElementById('validUntil'),
        daysRemaining: document.getElementById('daysRemaining'),
        sslVersion: document.getElementById('sslVersion'),
        signatureAlgo: document.getElementById('signatureAlgo'),
        keyStrength: document.getElementById('keyStrength'),
        serialNumber: document.getElementById('serialNumber'),
        fingerprint: document.getElementById('fingerprint'),
        certChain: document.getElementById('certChain'),
        securityChecks: document.getElementById('securityChecks'),
        downloadBtn: document.getElementById('downloadBtn'),
        copyBtn: document.getElementById('copyBtn')
    };

    // State
    let state = {
        currentDomain: null,
        certData: null
    };

    // Event Listeners
    initializeEventListeners();

    function initializeEventListeners() {
        elements.checkBtn.addEventListener('click', checkSSLCertificate);
        elements.domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkSSLCertificate();
        });
        elements.downloadBtn.addEventListener('click', downloadReport);
        elements.copyBtn.addEventListener('click', copyResults);
    }

    async function checkSSLCertificate() {
        const domain = elements.domainInput.value.trim();
        if (!validateDomain(domain)) {
            showError('Please enter a valid domain name');
            return;
        }

        state.currentDomain = domain;
        showLoading(true);

        try {
            const certData = await fetchCertificateData(domain);
            state.certData = certData;
            updateUI(certData);
        } catch (error) {
            showError('Error checking SSL certificate: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    function validateDomain(domain) {
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    async function fetchCertificateData(domain) {
        // In a real implementation, this would make an API call to a backend service
        // For demonstration, we'll simulate the response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: 'valid',
                    issuer: 'Let\'s Encrypt Authority X3',
                    validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                    sslVersion: 'TLS 1.3',
                    signatureAlgorithm: 'SHA256withRSA',
                    keyStrength: '2048 bits',
                    serialNumber: '03:94:77:44:33:22:11:00',
                    fingerprint: 'SHA256 Fingerprint=AA:BB:CC:DD:EE:FF...',
                    chain: [
                        { name: domain, type: 'End-entity' },
                        { name: 'Let\'s Encrypt Authority X3', type: 'Intermediate' },
                        { name: 'DST Root CA X3', type: 'Root' }
                    ],
                    securityChecks: [
                        { name: 'Certificate Validity', status: 'pass' },
                        { name: 'Domain Match', status: 'pass' },
                        { name: 'Revocation Status', status: 'pass' },
                        { name: 'Protocol Security', status: 'warning', message: 'TLS 1.0 enabled' }
                    ]
                });
            }, 1500);
        });
    }

    function updateUI(certData) {
        elements.resultContainer.classList.remove('d-none');

        // Update status badge
        updateStatusBadge(certData.status);

        // Update basic info
        elements.domainName.textContent = state.currentDomain;
        elements.issuer.textContent = certData.issuer;
        elements.validFrom.textContent = formatDate(certData.validFrom);
        elements.validUntil.textContent = formatDate(certData.validUntil);
        elements.daysRemaining.textContent = calculateDaysRemaining(certData.validUntil);

        // Update security details
        elements.sslVersion.textContent = certData.sslVersion;
        elements.signatureAlgo.textContent = certData.signatureAlgorithm;
        elements.keyStrength.textContent = certData.keyStrength;
        elements.serialNumber.textContent = certData.serialNumber;
        elements.fingerprint.textContent = certData.fingerprint;

        // Update certificate chain
        updateCertificateChain(certData.chain);

        // Update security checks
        updateSecurityChecks(certData.securityChecks);
    }

    function updateStatusBadge(status) {
        elements.statusBadge.className = 'badge';
        switch (status) {
            case 'valid':
                elements.statusBadge.classList.add('bg-success');
                elements.statusBadge.textContent = 'Valid';
                break;
            case 'expired':
                elements.statusBadge.classList.add('bg-danger');
                elements.statusBadge.textContent = 'Expired';
                break;
            case 'warning':
                elements.statusBadge.classList.add('bg-warning');
                elements.statusBadge.textContent = 'Warning';
                break;
            default:
                elements.statusBadge.classList.add('bg-secondary');
                elements.statusBadge.textContent = 'Unknown';
        }
    }

    function updateCertificateChain(chain) {
        elements.certChain.innerHTML = chain.map((cert, index) => `
            <div class="chain-item">
                <div class="chain-connector">
                    ${index < chain.length - 1 ? '<i class="fas fa-arrow-down"></i>' : ''}
                </div>
                <div class="chain-cert">
                    <div class="cert-name">${cert.name}</div>
                    <div class="cert-type">${cert.type}</div>
                </div>
            </div>
        `).join('');
    }

    function updateSecurityChecks(checks) {
        elements.securityChecks.innerHTML = checks.map(check => `
            <div class="security-check-item">
                <div class="check-status">
                    <i class="fas fa-${getStatusIcon(check.status)}"></i>
                </div>
                <div class="check-details">
                    <div class="check-name">${check.name}</div>
                    ${check.message ? `<div class="check-message">${check.message}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    function getStatusIcon(status) {
        switch (status) {
            case 'pass': return 'check-circle text-success';
            case 'warning': return 'exclamation-triangle text-warning';
            case 'fail': return 'times-circle text-danger';
            default: return 'question-circle text-secondary';
        }
    }

    function calculateDaysRemaining(validUntil) {
        const days = Math.ceil((new Date(validUntil) - new Date()) / (1000 * 60 * 60 * 24));
        return `${days} days`;
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function downloadReport() {
        if (!state.certData) return;

        const report = generateReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ssl-report-${state.currentDomain}-${formatDateForFilename(new Date())}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function generateReport() {
        const data = state.certData;
        return `SSL Certificate Report for ${state.currentDomain}
Generated: ${new Date().toLocaleString()}

CERTIFICATE STATUS: ${data.status.toUpperCase()}

Basic Information:
- Domain: ${state.currentDomain}
- Issuer: ${data.issuer}
- Valid From: ${formatDate(data.validFrom)}
- Valid Until: ${formatDate(data.validUntil)}
- Days Remaining: ${calculateDaysRemaining(data.validUntil)}

Security Details:
- SSL/TLS Version: ${data.sslVersion}
- Signature Algorithm: ${data.signatureAlgorithm}
- Key Strength: ${data.keyStrength}
- Serial Number: ${data.serialNumber}
- Fingerprint: ${data.fingerprint}

Certificate Chain:
${data.chain.map(cert => `- ${cert.type}: ${cert.name}`).join('\n')}

Security Checks:
${data.securityChecks.map(check => 
    `- ${check.name}: ${check.status.toUpperCase()}${check.message ? '\n  Message: ' + check.message : ''}`
).join('\n')}
`;
    }

    function copyResults() {
        if (!state.certData) return;

        const report = generateReport();
        navigator.clipboard.writeText(report)
            .then(() => showCopyFeedback(elements.copyBtn))
            .catch(err => {
                console.error('Failed to copy:', err);
                showError('Failed to copy to clipboard');
            });
    }

    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 1500);
    }

    function showLoading(show) {
        elements.loadingIndicator.classList.toggle('d-none', !show);
        elements.checkBtn.disabled = show;
    }

    function showError(message) {
        // Implement error display logic
        alert(message);
    }

    function formatDateForFilename(date) {
        return date.toISOString().split('T')[0];
    }
}); 