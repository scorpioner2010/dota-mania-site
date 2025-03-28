document.addEventListener('DOMContentLoaded', () => {
    // Для локального тестування, якщо сервер запущений локально, розкоментуй наступний рядок:
    // const serverUrl = "http://localhost:51754/api";

    // Використовується віддалений сервер за замовчуванням:
    const serverUrl = "https://dotamania.bsite.net/api";

    const containerList = document.getElementById('containerList');
    const containerCount = document.getElementById('containerCount');
    const loadingIndicator = document.getElementById('loading');

    function loadContainers() {
        fetch(`${serverUrl}/containers`)
            .then(res => res.json())
            .then(data => {
                containerList.innerHTML = '';
                containerCount.innerText = `Total Items: ${data.length}`;
                data.forEach(container => {
                    // Створення картки контейнера
                    const card = document.createElement('div');
                    card.className = 'container-item';

                    // Верхня частина: зображення
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'container-image';
                    const img = document.createElement('img');
                    if (container.imageBase64) {
                        img.src = `data:image/png;base64,${container.imageBase64}`;
                    } else {
                        img.src = 'data:image/png;base64,' + createWhitePlaceholderBase64();
                    }
                    imageDiv.appendChild(img);
                    card.appendChild(imageDiv);

                    // Нижня частина: ім'я та опис
                    const content = document.createElement('div');
                    content.className = 'container-content';
                    const nameEl = document.createElement('h3');
                    nameEl.className = 'container-name';
                    nameEl.innerText = container.name;
                    content.appendChild(nameEl);
                    const descEl = document.createElement('p');
                    descEl.className = 'container-desc';
                    descEl.innerText = container.description;
                    content.appendChild(descEl);
                    card.appendChild(content);

                    containerList.appendChild(card);
                });
                // Після завантаження ховаємо індикатор і показуємо сітку
                loadingIndicator.style.display = 'none';
                containerList.style.display = 'grid';
            })
            .catch(err => {
                console.error('Error loading containers:', err);
                containerList.innerText = 'Error loading containers.';
                loadingIndicator.style.display = 'none';
            });
    }

    // Функція для створення білої заглушки (64x64)
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

    loadContainers();
});
