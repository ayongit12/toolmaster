document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
    const API_ENDPOINTS = {
        general: 'https://api.remove.bg/v1.0/removebg',
        portrait: 'https://api.remove.bg/v1.0/removebg/portrait',
        product: 'https://api.remove.bg/v1.0/removebg/product',
        detailed: 'https://api.remove.bg/v1.0/removebg/hd'
    };

    // DOM Elements
    const elements = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        editorContainer: document.getElementById('editorContainer'),
        originalPreview: document.getElementById('originalPreview'),
        resultPreview: document.getElementById('resultPreview'),
        ai
    };

    const removalMethod = document.getElementById('removalMethod');
    const basicOptions = document.getElementById('basicOptions');
    const tolerance = document.getElementById('tolerance');
    const bgColor = document.getElementById('bgColor');
    const removeBtn = document.getElementById('removeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const processingMessage = document.getElementById('processingMessage');

    let originalImage = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle file selection
    elements.dropZone.addEventListener('drop', handleDrop);
    elements.fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }
}); 