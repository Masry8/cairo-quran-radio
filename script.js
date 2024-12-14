document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('radio');

    // Attempt to play the audio when the page loads
    audioPlayer.play().catch(error => {
        console.error('Autoplay failed:', error);
    });

    // Ensure the audio starts playing when it is ready
    audioPlayer.addEventListener('canplay', function() {
        audioPlayer.play().catch(error => {
            console.error('Play attempt failed:', error);
        });
    });
});

document.getElementById('stopButton').addEventListener('click', function() {
    const radio = document.getElementById('radio');
    radio.pause();
    radio.currentTime = 0;
});

let mediaRecorder;
let recordedChunks = [];

document.getElementById('recordButton').addEventListener('click', function() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        alert('Recording stopped!');
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = []; // Clear previous recordings

                mediaRecorder.ondataavailable = function(event) {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = function() {
                    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'recording.webm';
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                };

                mediaRecorder.start();
                alert('Recording started!');
            })
            .catch(error => console.error('Error accessing media devices.', error));
    }
});
