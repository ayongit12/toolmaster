document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        textInput: document.getElementById('textInput'),
        fileInput: document.getElementById('fileInput'),
        inputText: document.getElementById('inputText'),
        fileUpload: document.getElementById('fileUpload'),
        dropZone: document.getElementById('dropZone'),
        fileInfo: document.getElementById('fileInfo'),
        fileName: document.getElementById('fileName'),
        fileSize: document.getElementById('fileSize'),
        removeFile: document.getElementById('removeFile'),
        textInputContainer: document.getElementById('textInputContainer'),
        fileInputContainer: document.getElementById('fileInputContainer'),
        generateBtn: document.getElementById('generateBtn'),
        results: document.getElementById('results'),
        md5: document.getElementById('md5'),
        sha1: document.getElementById('sha1'),
        sha256: document.getElementById('sha256'),
        sha512: document.getElementById('sha512'),
        uppercase: document.getElementById('uppercase')
    };

    // State
    let state = {
        currentFile: null,
        fileContent: null
    };

    // Event Listeners
    initializeEventListeners();

    function initializeEventListeners() {
        // Input type toggle
        elements.textInput.addEventListener('change', toggleInputType);
        elements.fileInput.addEventListener('change', toggleInputType);

        // File handling
        elements.fileUpload.addEventListener('change', handleFileSelect);
        elements.removeFile.addEventListener('click', removeFile);
        setupDropZone();

        // Generate hashes
        elements.generateBtn.addEventListener('click', generateHashes);
        elements.inputText.addEventListener('input', debounce(generateHashes, 300));

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', copyHash);
        });

        // Hash options
        [elements.md5, elements.sha1, elements.sha256, elements.sha512, elements.uppercase]
            .forEach(el => el.addEventListener('change', generateHashes));
    }

    function toggleInputType() {
        const isFileInput = elements.fileInput.checked;
        elements.textInputContainer.classList.toggle('d-none', isFileInput);
        elements.fileInputContainer.classList.toggle('d-none', !isFileInput);
        elements.results.classList.add('d-none');
    }

    function setupDropZone() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            elements.dropZone.addEventListener(eventName, preventDefaults);
        });

        elements.dropZone.addEventListener('drop', handleFileDrop);
        elements.dropZone.addEventListener('dragenter', () => {
            elements.dropZone.classList.add('drag-active');
        });
        elements.dropZone.addEventListener('dragleave', () => {
            elements.dropZone.classList.remove('drag-active');
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFileDrop(e) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        handleFile(file);
    }

    function handleFile(file) {
        if (!file) return;

        state.currentFile = file;
        elements.fileName.textContent = file.name;
        elements.fileSize.textContent = formatFileSize(file.size);
        elements.fileInfo.classList.remove('d-none');
        elements.dropZone.classList.add('d-none');

        const reader = new FileReader();
        reader.onload = (e) => {
            state.fileContent = e.target.result;
            generateHashes();
        };
        reader.readAsArrayBuffer(file);
    }

    function removeFile() {
        state.currentFile = null;
        state.fileContent = null;
        elements.fileUpload.value = '';
        elements.fileInfo.classList.add('d-none');
        elements.dropZone.classList.remove('d-none');
        elements.results.classList.add('d-none');
    }

    async function generateHashes() {
        const input = elements.fileInput.checked ? state.fileContent : elements.inputText.value;
        
        if (!input) {
            elements.results.classList.add('d-none');
            return;
        }

        const hashPromises = [];
        const selectedHashes = [];

        if (elements.md5.checked) {
            hashPromises.push(calculateHash(input, 'MD5'));
            selectedHashes.push('md5');
        }
        if (elements.sha1.checked) {
            hashPromises.push(calculateHash(input, 'SHA1'));
            selectedHashes.push('sha1');
        }
        if (elements.sha256.checked) {
            hashPromises.push(calculateHash(input, 'SHA256'));
            selectedHashes.push('sha256');
        }
        if (elements.sha512.checked) {
            hashPromises.push(calculateHash(input, 'SHA512'));
            selectedHashes.push('sha512');
        }

        try {
            const hashes = await Promise.all(hashPromises);
            updateResults(hashes, selectedHashes);
            elements.results.classList.remove('d-none');
        } catch (error) {
            console.error('Error generating hashes:', error);
            showError('Error generating hashes. Please try again.');
        }
    }

    async function calculateHash(input, algorithm) {
        if (elements.fileInput.checked) {
            return await calculateFileHash(input, algorithm);
        } else {
            return calculateTextHash(input, algorithm);
        }
    }

    function calculateTextHash(text, algorithm) {
        let hash;
        switch (algorithm) {
            case 'MD5':
                hash = CryptoJS.MD5(text);
                break;
            case 'SHA1':
                hash = CryptoJS.SHA1(text);
                break;
            case 'SHA256':
                hash = CryptoJS.SHA256(text);
                break;
            case 'SHA512':
                hash = CryptoJS.SHA512(text);
                break;
        }
        return hash.toString();
    }

    async function calculateFileHash(arrayBuffer, algorithm) {
        // Convert ArrayBuffer to WordArray
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        
        let hash;
        switch (algorithm) {
            case 'MD5':
                hash = CryptoJS.MD5(wordArray);
                break;
            case 'SHA1':
                hash = CryptoJS.SHA1(wordArray);
                break;
            case 'SHA256':
                hash = CryptoJS.SHA256(wordArray);
                break;
            case 'SHA512':
                hash = CryptoJS.SHA512(wordArray);
                break;
        }
        return hash.toString();
    }

    function updateResults(hashes, types) {
        types.forEach((type, index) => {
            const resultElement = document.getElementById(`${type}Result`);
            let hash = hashes[index];
            
            if (elements.uppercase.checked) {
                hash = hash.toUpperCase();
            }
            
            resultElement.querySelector('.hash-output').textContent = hash;
            resultElement.classList.remove('d-none');
        });
    }

    function copyHash(e) {
        const hashOutput = e.currentTarget.closest('.result-item')
            .querySelector('.hash-output').textContent;
        
        navigator.clipboard.writeText(hashOutput).then(() => {
            showCopyFeedback(e.currentTarget);
        }).catch(err => {
            console.error('Failed to copy:', err);
            showError('Failed to copy to clipboard');
        });
    }

    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML
    }
}); 