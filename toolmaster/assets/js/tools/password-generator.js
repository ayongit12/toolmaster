document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const CHAR_SETS = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const WORDS_LIST = [
        // Add a comprehensive list of common words for passphrases
        'apple', 'banana', 'orange', 'grape', 'melon',
        'dog', 'cat', 'bird', 'fish', 'lion',
        'red', 'blue', 'green', 'yellow', 'purple',
        'run', 'jump', 'swim', 'fly', 'walk',
        // ... add more words
    ];

    // DOM Elements
    const elements = {
        passwordOutput: document.getElementById('passwordOutput'),
        copyBtn: document.getElementById('copyBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        lengthSlider: document.getElementById('lengthSlider'),
        lengthValue: document.getElementById('lengthValue'),
        presets: document.getElementById('presets'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols'),
        wordCount: document.getElementById('wordCount'),
        separator: document.getElementById('separator'),
        passphraseOptions: document.getElementById('passphraseOptions'),
        strengthBar: document.getElementById('strengthBar'),
        strengthText: document.getElementById('strengthText'),
        passwordHistory: document.getElementById('passwordHistory')
    };

    // State
    let state = {
        history: [],
        lastPassword: ''
    };

    // Event Listeners
    initializeEventListeners();

    function initializeEventListeners() {
        elements.refreshBtn.addEventListener('click', generatePassword);
        elements.copyBtn.addEventListener('click', copyPassword);
        elements.lengthSlider.addEventListener('input', updateLengthValue);
        elements.presets.addEventListener('change', handlePresetChange);
        
        // Character options
        [elements.uppercase, elements.lowercase, elements.numbers, elements.symbols]
            .forEach(el => el.addEventListener('change', generatePassword));

        // Generate initial password
        generatePassword();
    }

    function generatePassword() {
        const preset = elements.presets.value;
        let password = '';

        if (preset === 'passphrase') {
            password = generatePassphrase();
        } else if (preset === 'pin') {
            password = generatePIN();
        } else if (preset === 'memorable') {
            password = generateMemorablePassword();
        } else {
            password = generateStandardPassword();
        }

        elements.passwordOutput.value = password;
        state.lastPassword = password;
        updateStrengthIndicator(password);
        addToHistory(password);
    }

    function generateStandardPassword() {
        let chars = '';
        if (elements.uppercase.checked) chars += CHAR_SETS.uppercase;
        if (elements.lowercase.checked) chars += CHAR_SETS.lowercase;
        if (elements.numbers.checked) chars += CHAR_SETS.numbers;
        if (elements.symbols.checked) chars += CHAR_SETS.symbols;

        if (!chars) {
            alert('Please select at least one character type');
            elements.lowercase.checked = true;
            chars = CHAR_SETS.lowercase;
        }

        const length = parseInt(elements.lengthSlider.value);
        let password = '';
        
        // Ensure at least one character from each selected type
        if (elements.uppercase.checked) 
            password += CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)];
        if (elements.lowercase.checked)
            password += CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)];
        if (elements.numbers.checked)
            password += CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)];
        if (elements.symbols.checked)
            password += CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)];

        // Fill remaining length with random characters
        while (password.length < length) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        // Shuffle the password
        return shuffleString(password);
    }

    function generatePassphrase() {
        const

    // Event listeners
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', () => {
        passwordOutput.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    });

    // Generate initial password
    generatePassword();
}); 