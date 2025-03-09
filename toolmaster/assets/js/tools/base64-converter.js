document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const converterOptions = document.getElementById('converterOptions');
    const imagePreview = document.getElementById('imagePreview');
    const originalSize = document.getElementById('originalSize');
    const base64Size = document.getElementById('base64Size');
    const outputFormat = document.getElementById('outputFormat');
    const base64Output = document.getElementById('base64Output');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');

    let currentFile = null;
    let currentBase64 = '';

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            currentFile = file;
            originalSize.textContent = formatFileSize(file.size);

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                currentBase64 = e.target.result;
                dropZone.classList.add('d-none');
                converterOptions.classList.remove('d-none');
                updateOutput();
            };
            reader.readAsDataURL(file);
        }
    }

    function updateOutput() {
        let output = currentBase64;
        if (outputFormat.value === 'base64') {
            // Remove the Data URL prefix
            output = currentBase64.split(',')[1];
        }
        base64Output.value = output;
        base64Size.textContent = formatFileSize(output.length);
    }

    outputFormat.addEventListener('change', updateOutput);

    convertBtn.addEventListener('click', updateOutput);

    copyBtn.addEventListener('click', () => {
        base64Output.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 