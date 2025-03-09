document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorPreview = document.getElementById('colorPreview');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');

    function updateColorValues(color) {
        // Update preview
        colorPreview.style.backgroundColor = color;
        
        // Update HEX
        hexValue.value = color;
        
        // Convert to RGB
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        rgbValue.value = `rgb(${r}, ${g}, ${b})`;
        
        // Convert to HSL
        const [h, s, l] = RGBToHSL(r, g, b);
        hslValue.value = `hsl(${h}°, ${s}%, ${l}%)`;
    }

    function RGBToHSL(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(l * 100)
        ];
    }

    // Copy button functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(`${btn.dataset.value}Value`);
            input.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 1500);
        });
    });

    colorPicker.addEventListener('input', (e) => updateColorValues(e.target.value));
    updateColorValues(colorPicker.value);
}); 