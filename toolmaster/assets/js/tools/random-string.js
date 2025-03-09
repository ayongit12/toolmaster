document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            length: document.getElementById('stringLength'),
            quantity: document.getElementById('quantity'),
            preset: document.getElementById('presetType'),
            customChars: document.getElementById('customChars'),
            checkboxes: {
                uppercase: document.getElementById('useUppercase'),
                lowercase: document.getElementById('useLowercase'),
                numbers: document.getElementById('useNumbers'),
                special: document.getElementById('useSpecial'),
                excludeSimilar: document.getElementById('excludeSimilar'),
                excludeAmbiguous: document.getElementById('excludeAmbiguous')
            }
        },
        buttons: {
            generate: document.getElementById('generateBtn'),
            copyAll: document.getElementById('copyAllBtn'),
            decreaseLength: document.getElementById('decreaseLength'),
            increaseLength: document.getElementById('increaseLength')
        },
        containers: {
            results: document.getElementById('resultContainer'),
            charDist: document.getElementById('charDistribution'),
            entropy: document.getElementById('entropyScore'),
            strengthBar: document.getElementById('strengthBar'),
            strengthText: document.getElementById('strengthText')
        }
    };

    // Character Sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()-_=+[]{}|;:,.<>?',
        similar: 'il1Lo0O',
        ambiguous: '{}[]()/\\\'"`~,;:.<>'
    };

    // Presets
    const presets = {
        password: {
            length: 16,
            sets: ['uppercase', 'lowercase', 'numbers', 'special']
        },
        pin: {
            length: 4,
            sets: ['numbers']
        },
        uuid: {
            length: 36,
            custom: () => generateUUID()
        },
        hex: {
            length: 16,
            custom: (len) => Array(len).fill(0).map(() => 
                Math.floor(Math.random() * 16).toString(16)).join('')
        },
        base64: {
            length: 24,
            custom: (len) => btoa(Array(Math.ceil(len * 3/4))
                .fill(0).map(() => Math.random() * 256 | 0)
                .map(b => String.fromCharCode(b)).join('')).slice(0, len)
        }
    };

    // Initialize
    initializeEventListeners();

    function initializeEventListeners() {
        elements.buttons.generate.addEventListener('click', generateStrings);
        elements.buttons.copyAll.addEventListener('click', copyAllStrings);
        elements.buttons.decreaseLength.addEventListener('click', () => adjustLength(-1));
        elements.buttons.increaseLength.addEventListener('click', () => adjustLength(1));
        elements.inputs.preset.addEventListener('change', handlePresetChange);

        // Update character set when checkboxes change
        Object.values(elements.inputs.checkboxes).forEach(checkbox => {
            checkbox.addEventListener('change', updateCharacterSet);
        });
    }

    function adjustLength(delta) {
        const currentLength = parseInt(elements.inputs.length.value) || 0;
        elements.inputs.length.value = Math.max(1, Math.min(1000, currentLength + delta));
    }

    function handlePresetChange() {
        const preset = presets[elements.inputs.preset.value];
        if (preset) {
            elements.inputs.length.value = preset.length;
            
            // Reset all checkboxes
            Object.keys(elements.inputs.checkboxes).forEach(key => {
                elements.inputs.checkboxes[key].checked = false;
            });

            // Set appropriate checkboxes for preset
            if (preset.sets) {
                preset.sets.forEach(set => {
                    const checkbox = elements.inputs.checkboxes[set];
                    if (checkbox) checkbox.checked = true;
                });
            }
        }
    }

    function generateStrings() {
        const config = getConfig();
        const results = [];
        const quantity = parseInt(elements.inputs.quantity.value) || 1;

        for (let i = 0; i < quantity; i++) {
            const result = generateString(config);
            results.push(result);
        }

        displayResults(results);
        analyzeResults(results);
    }

    function getConfig() {
        const preset = elements.inputs.preset.value;
        const length = parseInt(elements.inputs.length.value) || 12;

        if (preset !== 'custom' && presets[preset]?.custom) {
            return { preset, length };
        }

        let chars = '';
        if (elements.inputs.checkboxes.uppercase.checked) chars += charSets.uppercase;
        if (elements.inputs.checkboxes.lowercase.checked) chars += charSets.lowercase;
        if (elements.inputs.checkboxes.numbers.checked) chars += charSets.numbers;
        if (elements.inputs.checkboxes.special.checked) chars += charSets.special;

        const customChars = elements.inputs.customChars.value;
        if (customChars) chars += customChars;

        if (elements.inputs.checkboxes.excludeSimilar.checked) {
            chars = chars.split('').filter(c => !charSets.similar.includes(c)).join('');
        }
        if (elements.inputs.checkboxes.excludeAmbiguous.checked) {
            chars = chars.split('').filter(c => !charSets.ambiguous.includes(c)).join('');
        }

        return { chars, length };
    }

    function generateString(config) {
        if (config.preset) {
            return presets[config.preset].custom(config.length);
        }

        if (!config.chars) {
            return 'Please select at least one character set';
        }

        let result = '';
        const chars = config.chars;
        for (let i = 0; i < config.length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function displayResults(results) {
        elements.containers.results.innerHTML = results.map((result, index) => `
            <div class="result-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="result-text">${result}</span>
                    <button class="btn btn-sm btn-outline-secondary copy-btn" 
                            data-string="${result}">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add copy button listeners
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                copyToClipboard(btn.dataset.string, btn);
            });
        });
    }

    function analyzeResults(results) {
        const combinedString = results.join('');
        
        // Character distribution
        const distribution = {};
        for (const char of combinedString) {
            distribution[char] = (distribution[char] || 0) + 1;
        }

        elements.containers.charDist.innerHTML = Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .map(([char, count]) => `
                <span class="badge bg-secondary me-1">
                    ${char}: ${count} (${(count/combinedString.length*100).toFixed(1)}%)
                </span>
            `).join('');

        // Entropy calculation
        const entropy = calculateEntropy(combinedString);
        elements.containers.entropy.textContent = 
            `${entropy.toFixed(2)} bits per character`;

        // Password strength (for first result if multiple)
        if (results.length > 0) {
            const strength = calculatePasswordStrength(results[0]);
            updateStrengthIndicator(strength);
        }
    }

    function calculateEntropy(string) {
        const len = string.length;
        const uniqueChars = new Set(string).size;
        return Math.log2(uniqueChars) * len / Math.LN2;
    }

    function calculatePasswordStrength(string) {
        const entropy = calculateEntropy(string);
        const strength = Math.min(100, Math.max(0, (entropy - 40) / 2));
        return strength;
    }

    function updateStrengthIndicator(strength) {
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        strengthBar.style.width = `${strength}%`;
        strengthText.textContent = `${strength}%`;
    }

    function copyToClipboard(text, button) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
    }

    function copyAllStrings() {
        const results = document.querySelectorAll('.result-item .result-text');
        const texts = Array.from(results).map(el => el.textContent);
        const text = texts.join('\n');
        copyToClipboard(text, document.getElementById('copyAllBtn'));
    }

    function updateCharacterSet() {
        const config = getConfig();
        const results = [];
        const quantity = parseInt(elements.inputs.quantity.value) || 1;

        for (let i = 0; i < quantity; i++) {
            const result = generateString(config);
            results.push(result);
        }

        displayResults(results);
        analyzeResults(results);
    }
}); 