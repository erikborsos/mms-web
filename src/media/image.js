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

thresholdSlider.addEventListener('input', () => {
    currentThreshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = currentThreshold;

    if (originalImageData && thresholdActive) {
        applyThresholdFilter();
    }
});

subsamplingSlider.addEventListener('input', () => {
    subsamplingRate = parseInt(subsamplingSlider.value);
    subsamplingValue.textContent = subsamplingRate;

    if (originalImageData && subsamplingActive) {
        applySubsamplingFilter();
    }

})

window.addEventListener("load", () => {
    const img = new Image();
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = "./squirrel.jpg";
});

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

function resetImage() {
    ctx.putImageData(originalImageData, 0, 0);
    thresholdActive = false;
    thresholdSliderContainer.classList.remove('flex');
    thresholdSliderContainer.classList.add('hidden');

    subsamplingActive = false;
    subsamplingSliderContainer.classList.remove('flex');
    subsamplingSliderContainer.classList.add('hidden');
}