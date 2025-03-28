document.addEventListener('DOMContentLoaded', () => {
    // Для локального тестування, якщо сервер запущений локально, розкоментуй наступний рядок:
    // const serverUrl = "http://localhost:51754/api";

    // Використовується віддалений сервер за замовчуванням:
    const serverUrl = "https://dotamania.bsite.net/api";

    // Елементи сторінки
    const containerList = document.getElementById('containerList');
    const containerCount = document.getElementById('containerCount');
    const nameInput = document.getElementById('nameInput');
    const descInput = document.getElementById('descInput');
    const loadBtn = document.getElementById('loadBtn');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const sendBtn = document.getElementById('sendBtn');
    const removeBtn = document.getElementById('removeBtn');
    const statusDiv = document.getElementById('status');

    let selectedFile = null;

    // Функція для завантаження контейнерів
    function loadContainers() {
        statusDiv.innerText = 'Loading containers...';
        fetch(`${serverUrl}/containers`)
            .then(res => res.json())
            .then(data => {
                containerList.innerHTML = '';
                containerCount.innerText = `Containers: ${data.length}`;
                statusDiv.innerText = 'Containers loaded.';
                data.forEach(container => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'container-item';

                    const img = document.createElement('img');
                    if (container.imageBase64) {
                        img.src = `data:image/png;base64,${container.imageBase64}`;
                    } else {
                        img.src = 'data:image/png;base64,' + createWhitePlaceholderBase64();
                    }
                    itemDiv.appendChild(img);

                    const nameP = document.createElement('p');
                    nameP.innerText = `Name: ${container.name}`;
                    itemDiv.appendChild(nameP);

                    const descP = document.createElement('p');
                    descP.innerText = `Description: ${container.description}`;
                    itemDiv.appendChild(descP);

                    containerList.appendChild(itemDiv);
                });
            })
            .catch(err => {
                console.error('Error loading containers:', err);
                statusDiv.innerText = 'Error loading containers.';
            });
    }

    // Load image із перевіркою розмірів
    loadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const img = new Image();
            img.onload = function() {
                // Перевірка максимальних розмірів 1024x2024
                if (img.width > 1024 || img.height > 2024) {
                    alert("Розміри зображення перевищують дозволені 1024×2024. Будь ласка, виберіть інше зображення.");
                    imageInput.value = ''; // скинути вибір
                    selectedFile = null;
                    previewImage.src = '';
                } else {
                    selectedFile = file;
                    previewImage.src = URL.createObjectURL(file);
                }
            };
            img.src = URL.createObjectURL(file);
        }
    });

    // Send container
    sendBtn.addEventListener('click', () => {
        if (!nameInput.value) {
            statusDiv.innerText = 'Please enter a container name.';
            return;
        }
        let fileToSend = selectedFile;
        if (!fileToSend) {
            statusDiv.innerText = 'No image selected. Creating white 64×64 placeholder.';
            fileToSend = createWhitePlaceholderBlob();
        }
        const formData = new FormData();
        formData.append('name', nameInput.value);
        formData.append('description', descInput.value);
        formData.append('image', fileToSend, 'sprite.png');

        statusDiv.innerText = 'Sending container...';
        fetch(`${serverUrl}/containers`, { method: 'POST', body: formData })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                statusDiv.innerText = `Container "${nameInput.value}" uploaded successfully!`;
                nameInput.value = '';
                descInput.value = '';
                selectedFile = null;
                previewImage.src = '';
                loadContainers();
            })
            .catch(err => {
                console.error('Error sending container:', err);
                statusDiv.innerText = 'Error sending container.';
            });
    });

    // Remove container
    removeBtn.addEventListener('click', () => {
        if (!nameInput.value) {
            statusDiv.innerText = 'Please enter a container name to remove.';
            return;
        }
        statusDiv.innerText = 'Removing container...';
        fetch(`${serverUrl}/containers/${nameInput.value}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                statusDiv.innerText = `Container "${nameInput.value}" removed successfully!`;
                nameInput.value = '';
                descInput.value = '';
                selectedFile = null;
                previewImage.src = '';
                loadContainers();
            })
            .catch(err => {
                console.error('Error removing container:', err);
                statusDiv.innerText = 'Error removing container.';
            });
    });

    // Функції для "білої заглушки"
    function createWhitePlaceholderBase64() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        return canvas.toDataURL('image/png').split(',')[1];
    }
    function createWhitePlaceholderBlob() {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        return dataURLtoBlob(canvas.toDataURL('image/png'));
    }
    function dataURLtoBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    loadContainers();
});
