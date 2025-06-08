const canvas = document.getElementById('canvasImage');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let originalImageData = null;

const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdValue = document.getElementById('thresholdValue');
const sliderContainer = document.getElementById('slider-container');
let currentThreshold = 128;
let thresholdActive = false;

thresholdSlider.addEventListener('input', () => {
    currentThreshold = parseInt(thresholdSlider.value);
    thresholdValue.textContent = currentThreshold;

    if (originalImageData && thresholdActive) {
        applyThresholdFilter();
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
    sliderContainer.classList.remove('hidden');
    sliderContainer.classList.add('flex');
    applyThresholdFilter();
}

function applyThresholdFilter() {
    ctx.putImageData(originalImageData, 0, 0);

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

function resetImage() {
    ctx.putImageData(originalImageData, 0, 0);
    thresholdActive = false;
    sliderContainer.classList.remove('flex');
    sliderContainer.classList.add('hidden');
}