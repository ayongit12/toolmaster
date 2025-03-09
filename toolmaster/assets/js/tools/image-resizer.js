document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const imageEditor = document.getElementById('imageEditor');
    const imagePreview = document.getElementById('imagePreview');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const resizeBtn = document.getElementById('resizeBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;
    let aspectRatio = 1;

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
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    aspectRatio = originalImage.width / originalImage.height;
                    widthInput.value = originalImage.width;
                    heightInput.value = originalImage.height;
                    imagePreview.src = e.target.result;
                    dropZone.classList.add('d-none');
                    imageEditor.classList.remove('d-none');
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Maintain aspect ratio when width/height changes
    widthInput.addEventListener('input', () => {
        if (maintainAspectRatio.checked) {
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainAspectRatio.checked) {
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    });

    resizeBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            downloadBtn.download = 'resized-image.png';
            downloadBtn.classList.remove('d-none');
        }, 'image/png');
    });
}); 