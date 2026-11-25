document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ОБЩАЯ ЛОГИКА МОДАЛЬНЫХ ОКОН (как было)
    // ==========================================
    const openButtons = document.querySelectorAll('[data-target]');
    openButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) modal.showModal();
        });
    });

    const modals = document.querySelectorAll('dialog');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {
                modal.close();
            }
        });
    });

    // ==========================================
    // 2. ЛОГИКА ФОРМЫ БОНУСНОЙ КАРТЫ
    // ==========================================
    const cardForm = document.getElementById('bonusCardForm');
    
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Останавливаем перезагрузку страницы
            
            // Получаем поля
            const nameInput = document.getElementById('userName');
            const phoneInput = document.getElementById('userPhone');
            const dateInput = document.getElementById('userDate');
            
            // Получаем блоки для ошибок
            const errName = document.getElementById('error-name');
            const errPhone = document.getElementById('error-phone');
            const errDate = document.getElementById('error-date');

            // Очищаем старые ошибки
            errName.textContent = '';
            errPhone.textContent = '';
            errDate.textContent = '';
            let isValid = true;

            // Валидация Имени
            if (nameInput.value.trim().length < 2) {
                errName.textContent = 'Пожалуйста, введите ваше имя (минимум 2 буквы).';
                isValid = false;
            }

            // Валидация Телефона (простая проверка на количество цифр)
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                errPhone.textContent = 'Введите корректный номер телефона.';
                isValid = false;
            }

            // Валидация Даты
            if (!dateInput.value) {
                errDate.textContent = 'Пожалуйста, укажите дату рождения.';
                isValid = false;
            }

            // Если всё заполнено верно
            if (isValid) {
                // 1. Сохраняем флаг в localStorage, что карта оформлена
                localStorage.setItem('bonusCardCreated', 'true');
                
                // 2. (Опционально) Можно сохранить данные пользователя
                // localStorage.setItem('userName', nameInput.value);

                // 3. Перекидываем на главную
                window.location.href = 'index.html'; 
            }
        });
    }

    // ==========================================
    // 3. ПОКАЗ ПЛАШКИ УСПЕХА НА ГЛАВНОЙ СТРАНИЦЕ
    // ==========================================
    // Проверяем, есть ли флаг в localStorage
    if (localStorage.getItem('bonusCardCreated') === 'true') {
        // Создаем элемент плашки
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = 'Бонусная карта успешно оформлена!<br><span style="font-size:0.8em; opacity:0.9;">Ждем вас в таверне!</span>';
        
        // Добавляем на страницу
        document.body.appendChild(toast);
        
        // Удаляем флаг, чтобы при обновлении страницы плашка больше не появлялась
        localStorage.removeItem('bonusCardCreated');

        // Анимация появления
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Скрываем через 4 секунды
        setTimeout(() => {
            toast.classList.remove('show');
            // Удаляем элемент из DOM через время после скрытия
            setTimeout(() => toast.remove(), 500); 
        }, 4000);
    }
});