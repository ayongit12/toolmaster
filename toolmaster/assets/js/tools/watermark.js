document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const watermarkOptions = document.getElementById('watermarkOptions');
    const watermarkType = document.getElementById('watermarkType');
    const textOptions = document.getElementById('textOptions');
    const imageOptions = document.getElementById('imageOptions');
    const watermarkText = document.getElementById('watermarkText');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const opacity = document.getElementById('opacity');
    const watermarkImageInput = document.getElementById('watermarkImageInput');
    const watermarkSize = document.getElementById('watermarkSize');
    const previewCanvas = document.getElementById('previewCanvas');
    const applyWatermarkBtn = document.getElementById('applyWatermarkBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;
    let watermarkImage = null;

    // Handle watermark type change
    watermarkType.addEventListener('change', () => {
        if (watermarkType.value === 'text') {
            textOptions.classList.remove('d-none');
            imageOptions.classList.add('d-none');
        } else {
            textOptions.classList.add('d-none');
            imageOptions.classList.remove('d-none');
        }
    });

    // Handle file input change
    fileInput.addEventListener('change', handleFileInputChange);

    function handleFileInputChange(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    originalImage = new Image();
                    originalImage.src = e.target.result;
                    originalImage.onload = function() {
                        updatePreview();
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function updatePreview() {
        if (originalImage) {
            const canvas = document.createElement('canvas');
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImage, 0, 0);

            if (watermarkImage) {
                const watermarkCtx = canvas.getContext('2d');
                watermarkCtx.globalAlpha = opacity.value / 100;
                watermarkCtx.drawImage(watermarkImage, 0, 0);
            }

            previewCanvas.width = canvas.width;
            previewCanvas.height = canvas.height;
            const previewCtx = previewCanvas.getContext('2d');
            previewCtx.drawImage(canvas, 0, 0);

            watermarkOptions.classList.remove('d-none');
            watermarkOptions.classList.add('d-block');
        }
    }

    // Handle watermark text change
    watermarkText.addEventListener('input', updatePreview);
    fontSize.addEventListener('input', updatePreview);
    textColor.addEventListener('input', updatePreview);
    opacity.addEventListener('input', updatePreview);

    // Handle watermark image change
    watermarkImageInput.addEventListener('change', handleWatermarkImageChange);

    function handleWatermarkImageChange(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    watermarkImage = new Image();
                    watermarkImage.src = e.target.result;
                    watermarkImage.onload = function() {
                        updatePreview();
                    };
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Handle watermark size change
    watermarkSize.addEventListener('input', updatePreview);

    // Handle apply watermark button click
    applyWatermarkBtn.addEventListener('click', applyWatermark);

    function applyWatermark() {
        if (originalImage && watermarkImage) {
            const canvas = document.createElement('canvas');
            canvas.width = originalImage.width;
            canvas.height = originalImage.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImage, 0, 0);

            const watermarkCtx = canvas.getContext('2d');
            watermarkCtx.globalAlpha = opacity.value / 100;
            watermarkCtx.drawImage(watermarkImage, 0, 0);

            const watermarkedImage = canvas.toDataURL('image/png');
            downloadBtn.href = watermarkedImage;
            downloadBtn.download = 'watermarked_image.png';
        }
    }
}); 