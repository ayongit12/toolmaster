document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        encrypt: document.getElementById('encrypt'),
        decrypt: document.getElementById('decrypt'),
        algorithm: document.getElementById('algorithm'),
        mode: document.getElementById('mode'),
        padding: document.getElementById('padding'),
        key: document.getElementById('key'),
        toggleKey: document.getElementById('toggleKey'),
        generateKey: document.getElementById('generateKey'),
        useIV: document.getElementById('useIV'),
        input: document.getElementById('input'),
        output: document.getElementById('output'),
        copyOutput: document.getElementById('copyOutput'),
        base64Output: document.getElementById('base64Output'),
        processBtn: document.getElementById('processBtn')
    };

    // Event Listeners
    initializeEventListeners();

    function initializeEventListeners() {
        elements.toggleKey.addEventListener('click', toggleKeyVisibility);
        elements.generateKey.addEventListener('click', generateRandomKey);
        elements.copyOutput.addEventListener('click', copyOutput);
        elements.processBtn.addEventListener('click', processData);
        elements.algorithm.addEventListener('change', updateUIBasedOnAlgorithm);
        
        // Update button text based on operation
        elements.encrypt.addEventListener('change', updateButtonText);
        elements.decrypt.addEventListener('change', updateButtonText);
    }

    function updateButtonText() {
        const isEncrypt = elements.encrypt.checked;
        elements.processBtn.innerHTML = `<i class="fas fa-${isEncrypt ? 'lock' : 'unlock'}"></i> ${isEncrypt ? 'Encrypt' : 'Decrypt'}`;
    }

    function toggleKeyVisibility() {
        const type = elements.key.type;
        elements.key.type = type === 'password' ? 'text' : 'password';
        elements.toggleKey.innerHTML = `<i class="fas fa-eye${type === 'password' ? '-slash' : ''}"></i>`;
    }

    function generateRandomKey() {
        const algorithm = elements.algorithm.value;
        let keyLength;

        switch (algorithm) {
            case 'aes':
                keyLength = 32; // 256 bits
                break;
            case 'des':
                keyLength = 8; // 64 bits
                break;
            case 'tripledes':
                keyLength = 24; // 192 bits
                break;
            case 'rc4':
                keyLength = 16; // 128 bits
                break;
            default:
                keyLength = 32;
        }

        const key = generateSecureKey(keyLength);
        elements.key.value = key;
    }

    function generateSecureKey(length) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function updateUIBasedOnAlgorithm() {
        const algorithm = elements.algorithm.value;
        const modeSelect = elements.mode;
        const paddingSelect = elements.padding;
        const useIVCheckbox = elements.useIV;

        // Reset options
        modeSelect.disabled = false;
        paddingSelect.disabled = false;
        useIVCheckbox.disabled = false;

        // Adjust UI based on algorithm
        switch (algorithm) {
            case 'aes':
                modeSelect.innerHTML = '<option value="cbc">CBC</option><option value="ecb">ECB</option><option value="cfb">CFB</option><option value="ofb">OFB</option>';
                paddingSelect.innerHTML = '<option value="pkcs7">PKCS7</option><option value="iso97971">ISO/IEC 9797-1</option><option value="ansix923">ANSI X.923</option><option value="iso10126">ISO 10126</option>';
                break;
            case 'des':
                modeSelect.innerHTML = '<option value="cbc">CBC</option><option value="ecb">ECB</option><option value="cfb">CFB</option><option value="ofb">OFB</option>';
                paddingSelect.innerHTML = '<option value="pkcs7">PKCS7</option><option value="iso97971">ISO/IEC 9797-1</option><option value="ansix923">ANSI X.923</option><option value="iso10126">ISO 10126</option>';
                break;
            case 'tripledes':
                modeSelect.innerHTML = '<option value="cbc">CBC</option><option value="ecb">ECB</option><option value="cfb">CFB</option><option value="ofb">OFB</option>';
                paddingSelect.innerHTML = '<option value="pkcs7">PKCS7</option><option value="iso97971">ISO/IEC 9797-1</option><option value="ansix923">ANSI X.923</option><option value="iso10126">ISO 10126</option>';
                break;
            case 'rc4':
                modeSelect.innerHTML = '<option value="rc4">RC4</option>';
                paddingSelect.innerHTML = '<option value="rc4">RC4</option>';
                paddingSelect.disabled = true;
                useIVCheckbox.disabled = true;
                break;
        }
    }

    function processData() {
        const algorithm = elements.algorithm.value;
        const mode = elements.mode.value;
        const padding = elements.padding.value;
        const key = elements.key.value;
        const useIV = elements.useIV.checked;
        const input = elements.input.value;
        const isEncrypt = elements.encrypt.checked;

        if (!input || !key) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const result = isEncrypt ? encrypt(input, key, algorithm, mode, padding, useIV) : decrypt(input, key, algorithm, mode, padding, useIV);
            elements.output.value = result;
            elements.base64Output.checked = false;
        } catch (e) {
            alert('An error occurred: ' + e.message);
        }
    }

    function encrypt(input, key, algorithm, mode, padding, useIV) {
        const keyBytes = hexToBytes(key);
        const ivBytes = useIV ? crypto.getRandomValues(new Uint8Array(16)) : null;
        const paddingBytes = padding === 'pkcs7' ? pkcs7Padding(input) : padding === 'iso97971' ? iso97971Padding(input) : padding === 'ansix923' ? ansix923Padding(input) : iso10126Padding(input);
        const inputBytes = new Uint8Array(input.length + paddingBytes.length);
        inputBytes.set(new Uint8Array(input.length));
        inputBytes.set(paddingBytes, input.length);

        const result = crypto.subtle.encrypt(
            { name: algorithm, mode: mode, padding: padding },
            crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['encrypt']),
            ivBytes,
            inputBytes
        );

        const encryptedBytes = new Uint8Array(await result);
        const encryptedHex = bytesToHex(encryptedBytes);
        return useIV ? bytesToHex(ivBytes) + ':' + encryptedHex : encryptedHex;
    }

    function decrypt(input, key, algorithm, mode, padding, useIV) {
        const [ivHex, encryptedHex] = input.split(':');
        const ivBytes = ivHex ? hexToBytes(ivHex) : null;
        const encryptedBytes = hexToBytes(encryptedHex);

        const result = crypto.subtle.decrypt(
            { name: algorithm, mode: mode, padding: padding },
            crypto.subtle.importKey('raw', hexToBytes(key), { name: 'AES-CBC' }, false, ['decrypt']),
            ivBytes,
            encryptedBytes
        );

        const decryptedBytes = new Uint8Array(await result);
        const decrypted = bytesToHex(decryptedBytes);
        return padding === 'pkcs7' ? decrypted.slice(0, -decryptedBytes[decryptedBytes.length - 1]) : decrypted;
    }

    function hexToBytes(hex) {
        return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    function bytesToHex(bytes) {
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function pkcs7Padding(input) {
        const blockSize = 16;
        const paddingLength = blockSize - (input.length % blockSize);
        const padding = new Uint8Array(paddingLength).fill(paddingLength);
        return new Uint8Array(input.length + paddingLength).set(new Uint8Array(input), 0).set(padding, input.length);
    }

    function iso97971Padding(input) {
        const blockSize = 8;
        const paddingLength = blockSize - (input.length % blockSize);
        const padding = new Uint8Array(paddingLength).fill(paddingLength);
        return new Uint8Array(input.length + paddingLength).set(new Uint8Array(input), 0).set(padding, input.length);
    }

    function ansix923Padding(input) {
        const blockSize = 8;
        const paddingLength = blockSize - (input.length % blockSize);
        const padding = new Uint8Array(paddingLength).fill(paddingLength);
        return new Uint8Array(input.length + paddingLength).set(new Uint8Array(input), 0).set(padding, input.length);
    }

    function iso10126Padding(input) {
        const blockSize = 8;
        const paddingLength = blockSize - (input.length % blockSize);
        const padding = new Uint8Array(paddingLength).fill(paddingLength);
        return new Uint8Array(input.length + paddingLength).set(new Uint8Array(input), 0).set(padding, input.length);
    }

    function copyOutput() {
        const output = elements.output.value;
        if (output) {
            const tempInput = document.createElement('input');
            tempInput.value = output;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Output copied to clipboard');
        }
    }
}); 