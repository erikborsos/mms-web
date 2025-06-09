const video = document.getElementById("video");
const playPauseBtn = document.getElementById("playPause");
const muteBtn = document.getElementById("muteBtn");
const seekBar = document.getElementById("seekBar");
const volumeSlider = document.getElementById("volume");


function playPause() {
    video.paused ? video.play() : video.pause();
}
// function fullscreen() {
//     if (!document.fullscreenElement) {
//         video.requestFullscreen();
//     } else {
//         document.exitFullscreen();
//     }
// }

function forwards() {
    video.currentTime += 5;
}
function backwards() {
    video.currentTime -= 5;
}

muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
        muteBtn.innerHTML = "<i class='fas fa-volume-mute text-xl'></i>"
    }
    else {
        adjustVolumeIcon();
    }
});

video.addEventListener('click', playPause);

video.addEventListener("play", () => {
    playPauseBtn.innerHTML = "<i class='fas fa-circle-pause text-3xl'></i>";
});

video.addEventListener("pause", () => {
    playPauseBtn.innerHTML = "<i class='fas fa-circle-play text-3xl'></i>";
});

video.addEventListener("timeupdate", () => {
    seekBar.value = video.currentTime;
});

seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
});

video.addEventListener("loadedmetadata", () => {
    seekBar.max = video.duration;
});

volumeSlider.addEventListener("input", () => {
    if (video.muted) {
        video.muted = !video.muted;
    }
    video.volume = volumeSlider.value;
    adjustVolumeIcon();
});

function adjustVolumeIcon() {
    if (volumeSlider.value > .5) {
        muteBtn.innerHTML = "<i class='fas fa-volume-high text-xl'></i>";
    }
    else if (volumeSlider.value > 0) {
        muteBtn.innerHTML = "<i class='fas fa-volume-low text-xl'></i>";
    }
    else {
        muteBtn.innerHTML = "<i class='fas fa-volume-off text-xl'></i>";
    }
}
