const canvasAudio = document.getElementById('canvasAudio');
const ctxAudio = canvasAudio.getContext('2d');
const audio = document.getElementById('audio');
const visualizerSelect = document.getElementById('visualizerSelect');

let red = Math.random() * 255;
let green = Math.random() * 255;
let blue = Math.random() * 255;
let audioCtx, analyser, source;
let currentVisualizer = 'frequency';

window.addEventListener("load", () => {
    audio.src = "./assets/audio/01Bad.mp3";
    initAudio();
});

document.getElementById("audioUpload").oninput = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        audio.src = e.target.result;
        initAudio();
    };
    reader.readAsDataURL(file);
};

audio.addEventListener('play', async () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    initAudio();
});

// Change visualizer when dropdown selection changes
visualizerSelect.addEventListener('change', (e) => {
    currentVisualizer = e.target.value;
    startVisualizer();
});

// Initialize audio context and analyzer
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;

        startVisualizer();
    }
}

// Start the selected visualizer
function startVisualizer() {
    if (currentVisualizer === 'wave') {
        visualizeWaveform();
    } else {
        visualizeFrequencyBars();
    }
}

// Frequency bars visualizer
function visualizeFrequencyBars() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctxAudio.clearRect(0, 0, canvasAudio.width, canvasAudio.height);

        const barWidth = (canvasAudio.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];
            ctxAudio.fillStyle = `rgb(${barHeight + 100}, ${green}, ${blue})`;
            ctxAudio.fillRect(x, canvasAudio.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    draw();
}

// Waveform visualizer
function visualizeWaveform() {
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        ctxAudio.clearRect(0, 0, canvasAudio.width, canvasAudio.height);

        ctxAudio.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
        ctxAudio.lineWidth = 2;
        ctxAudio.beginPath();

        const sliceWidth = canvasAudio.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const y = (dataArray[i] / 128.0) * (canvasAudio.height / 2);    // map audio amplitude to canvas height
            if (i === 0) ctxAudio.moveTo(x, y);     // sets the starting point of the path
            else ctxAudio.lineTo(x, y);             // draw a line from previous to current point
            x += sliceWidth;
        }

        ctxAudio.stroke();
    }

    draw();
}

function randomizeColors() {
    red = Math.random() * 255;
    green = Math.random() * 255;
    blue = Math.random() * 255;
}