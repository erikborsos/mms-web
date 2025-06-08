const canvasAudio = document.getElementById('canvasAudio');
const ctxAudio = canvasAudio.getContext('2d');
const audio = document.getElementById('audio');
let green = Math.random() * 255;
let blue = Math.random() * 255;

let audioCtx, analyser, source;

window.addEventListener("load", () => {
    audio.src = "./orangensaft-moneyboy.mp3";
    initAudio();
});

document.getElementById("audioUpload").oninput = async (evt) => {
    const file = evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {initAudio(reader.result);};
    reader.onload = function (e) {
        audio.src = e.target.result;
        initAudio();
    };
    reader.readAsDataURL(file);
};

audio.addEventListener('play', async () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    initAudio();
});

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;

        visualize();
    }
}

function visualize() {
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

function randomizeColors() {
    green = Math.random() * 255;
    blue = Math.random() * 255;
}