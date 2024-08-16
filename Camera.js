// window.addEventListener('load', async () => {
//     await StartCamera();
//     await PauseCamera();
// });

document.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById('video');

    video.addEventListener('play', () => {
        video.style.display = 'block';
    });

    video.addEventListener('pause', () => {
        video.style.display = 'none';
    });

    video.addEventListener('ended', () => {
        video.style.display = 'none';
    });
});

let cameraStream = null;
let video = document.getElementById('video');

async function StartCameraAsync() {
    
    if (!video) {
        console.error("Video element not found");
        return;
    }

    try {
        const constraints = { video: { facingMode: { exact: "environment" } } };
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = cameraStream;
    } catch (mobileErr) {
        console.warn('Could not access rear camera, falling back to default camera:', mobileErr);
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = cameraStream;
            video.style.display = 'none';
        } catch (pcErr) {
            console.error('Error accessing camera:', pcErr);
        }
    }

    video.onloadedmetadata = function () {
        adjustVideoSize();
    };

    window.onresize = adjustVideoSize;

    function adjustVideoSize() {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    }
}
function StartCamera() {
    StartCameraAsync().catch(error => {
        console.error('Error while Start camera:', error);
    });
}

async function PauseCameraAsync() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = false);
        console.log('Camera paused');
    } else {
        console.warn('No camera stream to pause');
    }
}
function PauseCamera() {
    PauseCameraAsync().catch(error => {
        console.error('Error while Pause camera:', error);
    });
}

async function ResumeCameraAsync() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = true);
        console.log('Camera resumed');
    } else {
        console.warn('No camera stream to resume');
    }
}
function ResumeCamera() {
    ResumeCameraAsync().catch(error => {
        console.error('Error while Resume camera:', error);
    });
}

async function StopCameraAsync() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        if (video) {
            video.srcObject = null;
        }
        console.log('Camera stopped');
    } else {
        console.warn('No camera stream to stop');
    }
}
function StopCamera() {
    StopCameraAsync().catch(error => {
        console.error('Error while Stop camera:', error);
    });
}
