document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const MAX_FILES = 10;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    // DOM Elements
    const elements = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        converterOptions: document.getElementById('converterOptions'),
        quality: document.getElementById('quality'),
        qualityValue: document.getElementById('qualityValue'),
        preserveMetadata: document.getElementById('preserveMetadata'),
        queueContainer: document.querySelector('.queue-container'),
        conversionProgress: document.querySelector('.conversion-progress'),
        progressBar: document.querySelector('.progress-bar'),
        progressCount: document.getElementById('progressCount'),
        convertBtn: document.getElementById('convertBtn'),
        clearBtn: document.getElementById('clearBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        downloadSingle: document.getElementById('downloadSingle'),
        downloadAll: document.getElementById('downloadAll')
    };

    // State
    let state = {
        files: [],
        convertedImages: [],
        currentFormat: 'png',
        isConverting: false
    };

    let originalImage = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle dropped files
    elements.dropZone.addEventListener('drop', handleDrop, false);
    elements.fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            originalFormat.textContent = file.type.split('/')[1].toUpperCase();
            originalSize.textContent = formatFileSize(file.size);

            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    imagePreview.src = e.target.result;
                    elements.dropZone.classList.add('d-none');
                    elements.converterOptions.classList.remove('d-none');
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    outputFormat.addEventListener('change', () => {
        // Show/hide quality slider for formats that support it
        qualityContainer.style.display = 
            ['jpeg', 'webp'].includes(outputFormat.value) ? 'block' : 'none';
    });

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    convertBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        ctx.drawImage(originalImage, 0, 0);
        
        const format = outputFormat.value;
        const quality = qualitySlider.value / 100;
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = `converted-image.${format}`;
            downloadBtn.classList.remove('d-none');
            
            newSize.textContent = formatFileSize(blob.size);
        }, `image/${format}`, format === 'png' ? undefined : quality);
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 