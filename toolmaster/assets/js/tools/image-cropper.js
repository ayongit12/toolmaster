document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const cropperContainer = document.getElementById('cropperContainer');
    const image = document.getElementById('image');
    const aspectRatio = document.getElementById('aspectRatio');
    const outputFormat = document.getElementById('outputFormat');
    const rotateLeftBtn = document.getElementById('rotateLeftBtn');
    const rotateRightBtn = document.getElementById('rotateRightBtn');
    const flipHorizontalBtn = document.getElementById('flipHorizontalBtn');
    const flipVerticalBtn = document.getElementById('flipVerticalBtn');
    const cropBtn = document.getElementById('cropBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');
    const previewContainer = document.getElementById('previewContainer');

    let cropper = null;

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
                image.src = e.target.result;
                dropZone.classList.add('d-none');
                cropperContainer.classList.remove('d-none');
                initCropper();
            };
            reader.readAsDataURL(file);
        }
    }

    function initCropper() {
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(image, {
            aspectRatio: parseFloat(aspectRatio.value),
            viewMode: 2,
            responsive: true,
            restore: true,
            autoCrop: true,
            movable: true,
            rotatable: true,
            scalable: true,
            zoomable: true,
            zoomOnTouch: true,
            zoomOnWheel: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: true,
        });
    }

    // Event listeners for controls
    aspectRatio.addEventListener('change', () => {
        cropper.setAspectRatio(parseFloat(aspectRatio.value));
    });

    rotateLeftBtn.addEventListener('click', () => {
        cropper.rotate(-90);
    });

    rotateRightBtn.addEventListener('click', () => {
        cropper.rotate(90);
    });

    flipHorizontalBtn.addEventListener('click', () => {
        cropper.scaleX(cropper.getData().scaleX * -1);
    });

    flipVerticalBtn.addEventListener('click', () => {
        cropper.scaleY(cropper.getData().scaleY * -1);
    });

    cropBtn.addEventListener('click', () => {
        const format = outputFormat.value;
        const mimeType = `image/${format}`;
        
        const croppedCanvas = cropper.getCroppedCanvas();
        preview.src = croppedCanvas.toDataURL(mimeType);
        previewContainer.classList.remove('d-none');
        
        croppedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloa
}); 