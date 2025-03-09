document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const converterOptions = document.getElementById('converterOptions');
    const imagePreview = document.getElementById('imagePreview');
    const outputFormat = document.getElementById('outputFormat');
    const outputFormatContainer = document.getElementById('outputFormatContainer');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalFormat = document.getElementById('originalFormat');
    const originalSize = document.getElementById('originalSize');
    const convertedSize = document.getElementById('convertedSize');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toWebp = document.getElementById('toWebp');
    const fromWebp = document.getElementById('fromWebp');

    let originalImage = null;

    // Update file input accept attribute based on conversion direction
    function updateFileInput() {
        if (toWebp.checked) {
            fileInput.accept = "image/*";
            outputFormat.value = "webp";
            outputFormatContainer.style.display = 'none';
        } else {
            fileInput.accept = ".webp";
            outputFormatContainer.style.display = 'block';
        }
    }

    toWebp.addEventListener('change', updateFileInput);
    fromWebp.addEventListener('change', updateFileInput);
    updateFileInput();

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
            originalFormat.textContent = file.type.split('/')[1].toUpperCase();
            originalSize.textContent = formatFileSize(file.size);

            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    imagePreview.src = e.target.result;
                    dropZone.classList.add('d-none');
                    converterOptions.classList.remove('d-none');
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    convertBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        ctx.drawImage(originalImage, 0, 0);
        
        const format = toWebp.checked ? 'webp' : outputFormat.value;
        const quality = qualitySlider.value / 100;
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = `converted-image.${format}`;
            downloadBtn.classList.remove('d-none');
            
            convertedSize.textContent = formatFileSize(blob.size);
        }, `image/${format}`, quality);
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 