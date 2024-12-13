document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('radio');
    const volumeControl = document.getElementById('volumeControl');
    const muteButton = document.getElementById('muteButton');
    const recordButton = document.getElementById('recordButton');
    const downloadLink = document.getElementById('downloadLink');

    // Attempt to play the audio automatically
    audioPlayer.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });

    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = volumeControl.value;
    });

    muteButton.addEventListener('click', function() {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audioPlayer.muted = true;
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    // Recording functionality
    let mediaRecorder;
    let recordedChunks = [];

    recordButton.addEventListener('click', function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordButton.innerHTML = '<i class="fas fa-record-vinyl"></i>';
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = function(event) {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    };
                    mediaRecorder.onstop = function() {
                        const blob = new Blob(recordedChunks, { type: 'audio/mpeg' });
                        const url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = 'recording.mp3';
                        downloadLink.style.display = 'block';
                        recordedChunks = [];
                    };
                    mediaRecorder.start();
                    recordButton.innerHTML = '<i class="fas fa-stop"></i>';
                })
                .catch(error => {
                    console.error('Error accessing media devices.', error);
                });
        }
    });

    document.getElementById('delayButton').addEventListener('click', function() {
        // Delay functionality
        const currentTime = new Date().getTime();
        const delayTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        const newTime = new Date(currentTime + delayTime);
        alert('Stream delayed by 6 hours!');
        // Implement actual delay logic here
    });
});