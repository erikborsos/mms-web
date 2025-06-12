const canvas = document.getElementById('canvasImage');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let originalImageData = null;

const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdValue = document.getElementById('thresholdValue');
const thresholdSliderContainer = document.getElementById('thresholdSliderContainer');
let currentThreshold = 128;
let thresholdActive = false;

const subsamplingSlider = document.getElementById('subsamplingSlider');
const subsamplingValue = document.getElementById('subsamplingValue');
const subsamplingSliderContainer = document.getElementById('subsamplingSliderContainer');
let subsamplingRate = 4;
let subsamplingActive = false;

let drawMode = false;
let isDrawing = false;

const drawControls = document.getElementById("drawControls");
const drawColor = document.getElementById("drawColor");
const lineWidthSlider = document.getElementById("lineWidth");
const lineWidthValue = document.getElementById("lineWidthValue");

// Initial style
ctx.strokeStyle = drawColor.value;
ctx.lineWidth = lineWidthSlider.value;

// change between draw and filter mode
document.getElementById("modeSelect").addEventListener("change", (e) => {
    resetImage();
    drawMode = e.target.value === "draw";

    // Show/hide drawing controls
    drawControls.classList.toggle("hidden", !drawMode);

    // disable filter buttons when in draw mode
    document.querySelectorAll(".controls button").forEach(btn => {
        if (btn.id !== "resetBtn") btn.disabled = drawMode;
    });

    canvas.style.cursor = drawMode ? "crosshair" : "default";
});

// start drawing on mousedown
canvas.addEventListener("mousedown", (e) => {
    if (!drawMode) return;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

// keep drawing while mouse is moving
canvas.addEventListener("mousemove", (e) => {
    if (!drawMode) return;
    if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// stop drawing on mouseup
canvas.addEventListener("mouseup", () => {
    if (drawMode) isDrawing = false;
});

// Update line width label
lineWidthSlider.addEventListener("input", () => {
    lineWidthValue.textContent = lineWidthSlider.value;
    ctx.lineWidth = lineWidthSlider.value;
});

// Update color
drawColor.addEventListener("input", () => {
    ctx.strokeStyle = drawColor.value;
});

// load initial image
window.addEventListener("load", () => {
    const img = new Image();
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = "./assets/img/squirrel.jpg";
});

// upload image from a device
document.getElementById("imageUpload").oninput = async (evt) => {
    thresholdActive = false;
    try {
        const file = evt.target.files[0];
        const bitmap = await createImageBitmap(file);
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    catch(err) {
        console.error(err);
    }
};

// slider for threshold value
thresholdSlider.addEventListener('input', () => {
    currentThreshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = currentThreshold;

    if (originalImageData && thresholdActive) {
        applyThresholdFilter();
    }
});

// slider for subsampling rate
subsamplingSlider.addEventListener('input', () => {
    subsamplingRate = parseInt(subsamplingSlider.value);
    subsamplingValue.textContent = subsamplingRate;

    if (originalImageData && subsamplingActive) {
        applySubsamplingFilter();
    }

});

// save current canvas as image
document.getElementById("saveImage").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});


function applyGrayscaleFilter() {
    resetImage();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = avg;
        data[i+1] = avg;
        data[i+2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
}

function callThresholdFilter() {
    thresholdActive = true;
    thresholdSliderContainer.classList.remove('hidden');
    thresholdSliderContainer.classList.add('flex');
    applyThresholdFilter();
}

function applyThresholdFilter() {
    ctx.putImageData(originalImageData, 0, 0);
    subsamplingActive = false;
    subsamplingSliderContainer.classList.remove('flex');
    subsamplingSliderContainer.classList.add('hidden');

    const threshold = currentThreshold;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        const newValue = avg < threshold ? 0 : 255;
        data[i] = data[i+1] = data[i+2] = newValue;
    }

    ctx.putImageData(imageData, 0, 0);
}

function applySepiaFilter() {
    resetImage();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }

    ctx.putImageData(imageData, 0, 0);
}

function callSubsamplingFilter() {
    subsamplingActive = true;
    subsamplingSliderContainer.classList.remove('hidden');
    subsamplingSliderContainer.classList.add('flex');
    applySubsamplingFilter();
}

function applySubsamplingFilter() {
    ctx.putImageData(originalImageData, 0, 0);
    thresholdActive = false;
    thresholdSliderContainer.classList.remove('flex');
    thresholdSliderContainer.classList.add('hidden');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const width = canvas.width;
    const height = canvas.height;

    const originalData = data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcX = x - (x % subsamplingRate);
            const srcY = y - (y % subsamplingRate);

            const srcIndex = (srcY * width + srcX) * 4;
            const destIndex = (y * width + x) * 4;

            data[destIndex]     = originalData[srcIndex];
            data[destIndex + 1] = originalData[srcIndex + 1];
            data[destIndex + 2] = originalData[srcIndex + 2];
            data[destIndex + 3] = originalData[srcIndex + 3];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyInvertFilter() {
    resetImage();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyBoxBlur() {
    resetImage();

    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const originalData = data;

    const kernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const kernelSize = 3;
    const kernelWeight = 9;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = 0; ky < kernelSize; ky++) {
                for (let kx = 0; kx < kernelSize; kx++) {
                    const px = x + kx - 1;
                    const py = y + ky - 1;
                    const offset = (py * width + px) * 4;

                    r += data[offset] * kernel[ky][kx];
                    g += data[offset + 1] * kernel[ky][kx];
                    b += data[offset + 2] * kernel[ky][kx];
                }
            }

            const idx = (y * width + x) * 4;
            originalData[idx] = r / kernelWeight;
            originalData[idx + 1] = g / kernelWeight;
            originalData[idx + 2] = b / kernelWeight;
        }
    }

    const blurred = new ImageData(originalData, width, height);
    ctx.putImageData(blurred, 0, 0);
}

function applyVignette() {
    resetImage();

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, maxRadius
    );

    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function resetImage() {
    ctx.putImageData(originalImageData, 0, 0);

    // hide threshold and subsampling sliders
    thresholdActive = false;
    thresholdSliderContainer.classList.remove('flex');
    thresholdSliderContainer.classList.add('hidden');

    subsamplingActive = false;
    subsamplingSliderContainer.classList.remove('flex');
    subsamplingSliderContainer.classList.add('hidden');
}