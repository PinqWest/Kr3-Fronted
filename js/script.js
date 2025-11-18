// script.js

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

// Данные для модалки (можешь расширять)
const projectInfo = {
    1: {
        title: "Сайт онлайн заказа (ASP.NET MVC)",
        text: "Полный функционал заказа, корзина, авторизация, MVC, SQL, Entity Framework."
    },
    2: {
        title: "Интернет-магазин (React + Node.js)",
        text: "Frontend на React, Node.js backend, REST API, JWT, адаптивный UI."
    },
    3: {
        title: "Телеграм-бот (Python Aiogram)",
        text: "Бот для приёма заказов, админ-панель, интеграции, база SQLite."
    }
};

// Открытие модального окна
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
        const id = card.dataset.project;
        modalTitle.textContent = projectInfo[id].title;
        modalText.textContent = projectInfo[id].text;

        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // фикс скролла
    });
});

// Закрытие модалки (крестик)
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
});

// Закрытие при клике вне окна
modal.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});


// Анимация появления карточек по очереди
const cards = document.querySelectorAll(".project-card");

cards.forEach((card, index) => {
    setTimeout(() => {
        card.classList.add("fade-up");
    }, index * 150); // задержка между карточками
});


