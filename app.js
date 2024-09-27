if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('myFirstSync');
    }).catch(err => {
        // Ako Background Sync nije dostupan, morate ručno poslati podatke
        console.log('Background Sync nije dostupan:', err);
    });
}

navigator.serviceWorker.ready.then(function(registration) {
    registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BET4p7lDa6f98EMn3TkCLp0bMkBi9pLSlF7Ep1buxsMeQhmBabIc0G3RMoMUO-ZbmFN-SIkNGzLCflxbpC5mWng'
    }).then(function(subscription) {
        console.log('Push subscription:', subscription);
    }).catch(function(error) {
        console.log('Failed to subscribe for push', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cameraStream = document.getElementById('cameraStream');
    const photoCanvas = document.getElementById('photoCanvas');
    const takePhotoButton = document.getElementById('takePhoto');

    // Funkcija za pokretanje kamere
    function startCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    cameraStream.srcObject = stream;
                })
                .catch(function(error) {
                    console.log("Greška prilikom pristupa kameri: ", error);
                });
        } else {
            console.log("getUserMedia nije podržan u ovom pregledniku.");
        }
    }

    // Funkcija za snimanje fotografije
    function takePhoto() {
        const context = photoCanvas.getContext('2d');
        if (cameraStream.videoWidth && cameraStream.videoHeight) {
            photoCanvas.width = cameraStream.videoWidth;
            photoCanvas.height = cameraStream.videoHeight;
            context.drawImage(cameraStream, 0, 0, cameraStream.videoWidth, cameraStream.videoHeight);
        }
    }

    takePhotoButton.addEventListener('click', takePhoto);

    startCamera();
});

