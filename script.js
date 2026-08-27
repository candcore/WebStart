"use strict";

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

function copyText(text, button) {
  navigator.clipboard.writeText(text.trim()).then(() => {
    const original = button.textContent;
    button.textContent = "Скопировано ✓";
    setTimeout(() => { button.textContent = original; }, 1600);
  }).catch(() => {
    button.textContent = "Выделите вручную";
  });
}

document.querySelectorAll(".lesson-code .copy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const code = button.closest(".code-window")?.querySelector("code")?.textContent;
    if (code) copyText(code, button);
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (target) copyText(target.textContent, button);
  });
});

/* Practice checklist */
const checklist = document.getElementById("practice-checklist");
if (checklist) {
  const checks = [...checklist.querySelectorAll("input[type='checkbox']")];
  const value = document.getElementById("progress-value");
  const bar = document.getElementById("progress-bar");
  const finish = document.getElementById("checklist-finish");
  const storageKey = "webstart-practice-progress";

  function readProgress() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
    catch { return {}; }
  }

  function updateProgress(save = true) {
    const state = {};
    checks.forEach((input) => { state[input.dataset.check] = input.checked; });
    if (save) localStorage.setItem(storageKey, JSON.stringify(state));
    const done = checks.filter((input) => input.checked).length;
    const percent = Math.round((done / checks.length) * 100);
    value.textContent = `${percent}%`;
    bar.style.width = `${percent}%`;
    finish.classList.toggle("show", percent === 100);
  }

  const stored = readProgress();
  checks.forEach((input) => {
    input.checked = Boolean(stored[input.dataset.check]);
    input.addEventListener("change", () => updateProgress(true));
  });
  updateProgress(false);

  document.getElementById("reset-progress")?.addEventListener("click", () => {
    checks.forEach((input) => { input.checked = false; });
    localStorage.removeItem(storageKey);
    updateProgress(false);
  });
}

/* Quiz */
const quizData = [
  {
    category: "HTML",
    question: "Какова основная задача HTML?",
    answers: ["Оформлять цвета страницы", "Создавать структуру содержимого", "Хранить данные на сервере", "Добавлять анимацию"],
    correct: 1,
    explanation: "HTML описывает структуру и смысл содержимого: заголовки, абзацы, ссылки, изображения и другие элементы."
  },
  {
    category: "HTML",
    question: "Какой тег содержит видимое содержимое страницы?",
    answers: ["<head>", "<meta>", "<body>", "<title>"],
    correct: 2,
    explanation: "Внутри <body> находится всё, что пользователь видит в окне браузера."
  },
  {
    category: "HTML",
    question: "Какой тег используется для создания ссылки?",
    answers: ["<link>", "<a>", "<href>", "<url>"],
    correct: 1,
    explanation: "Ссылка создаётся тегом <a>, а адрес указывается в атрибуте href."
  },
  {
    category: "HTML",
    question: "Какой вариант является семантическим тегом?",
    answers: ["<div>", "<span>", "<section>", "<b>"],
    correct: 2,
    explanation: "<section> сообщает назначение блока — отдельный тематический раздел страницы."
  },
  {
    category: "CSS",
    question: "Как правильно подключить внешний CSS-файл?",
    answers: ["<css src='style.css'>", "<style href='style.css'>", "<link rel='stylesheet' href='style.css'>", "<script src='style.css'>"],
    correct: 2,
    explanation: "Внешняя таблица стилей подключается тегом <link> внутри раздела <head>."
  },
  {
    category: "CSS",
    question: "Какой селектор выбирает элементы с классом card?",
    answers: ["#card", ".card", "card", "*card"],
    correct: 1,
    explanation: "Точка перед именем обозначает селектор класса: .card."
  },
  {
    category: "CSS",
    question: "Какое свойство задаёт внутренний отступ?",
    answers: ["margin", "gap", "padding", "border"],
    correct: 2,
    explanation: "Padding создаёт пространство между содержимым элемента и его рамкой."
  },
  {
    category: "CSS",
    question: "Какое свойство задаёт внешний отступ?",
    answers: ["margin", "padding", "width", "display"],
    correct: 0,
    explanation: "Margin создаёт пространство снаружи границы элемента."
  },
  {
    category: "CSS",
    question: "Как включить Flexbox для контейнера?",
    answers: ["position: flex", "layout: flex", "display: flex", "flex: display"],
    correct: 2,
    explanation: "Flex-контейнер создаётся правилом display: flex."
  },
  {
    category: "Адаптивность",
    question: "Для чего используется @media в CSS?",
    answers: ["Для подключения видео", "Для адаптации стилей под размер экрана", "Для загрузки шрифтов", "Для создания HTML-тегов"],
    correct: 1,
    explanation: "Медиазапросы применяют разные стили в зависимости от ширины экрана и других характеристик устройства."
  }
];

const intro = document.getElementById("quiz-intro");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("quiz-result");

if (intro && quizCard && resultCard) {
  const questionCounter = document.getElementById("question-counter");
  const scoreLive = document.getElementById("score-live");
  const progressBar = document.getElementById("quiz-progress-bar");
  const questionTag = document.getElementById("question-tag");
  const questionText = document.getElementById("question-text");
  const answersNode = document.getElementById("answers");
  const explanation = document.getElementById("answer-explanation");
  const explanationTitle = document.getElementById("explanation-title");
  const explanationText = document.getElementById("explanation-text");
  const nextButton = document.getElementById("next-question");
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  function showQuestion() {
    const item = quizData[questionIndex];
    answered = false;
    questionCounter.textContent = `Вопрос ${questionIndex + 1} из ${quizData.length}`;
    scoreLive.textContent = `${score} ${score === 1 ? "балл" : "баллов"}`;
    progressBar.style.width = `${(questionIndex / quizData.length) * 100}%`;
    questionTag.textContent = item.category;
    questionText.textContent = item.question;
    answersNode.innerHTML = "";
    explanation.hidden = true;
    nextButton.disabled = true;
    nextButton.textContent = questionIndex === quizData.length - 1 ? "Показать результат →" : "Следующий вопрос →";

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><b></b>`;
      button.querySelector("b").textContent = answer;
      button.addEventListener("click", () => chooseAnswer(index));
      answersNode.appendChild(button);
    });
  }

  function chooseAnswer(selected) {
    if (answered) return;
    answered = true;
    const item = quizData[questionIndex];
    const buttons = [...answersNode.querySelectorAll(".answer-button")];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === item.correct) button.classList.add("correct");
      if (index === selected && selected !== item.correct) button.classList.add("wrong");
    });
    if (selected === item.correct) {
      score += 1;
      explanationTitle.textContent = "Верно!";
    } else {
      explanationTitle.textContent = "Почти. Правильный ответ выделен зелёным.";
    }
    scoreLive.textContent = `${score} ${score === 1 ? "балл" : "баллов"}`;
    explanationText.textContent = item.explanation;
    explanation.hidden = false;
    nextButton.disabled = false;
  }

  function showResult() {
    quizCard.hidden = true;
    resultCard.hidden = false;
    const percent = Math.round((score / quizData.length) * 100);
    document.getElementById("result-percent").textContent = `${percent}%`;
    document.getElementById("correct-count").textContent = score;
    document.getElementById("wrong-count").textContent = quizData.length - score;
    document.getElementById("result-ring").style.setProperty("--score", `${percent * 3.6}deg`);
    const title = document.getElementById("result-title");
    const message = document.getElementById("result-message");
    if (percent >= 90) {
      title.textContent = "Превосходный результат!";
      message.textContent = "Ты уверенно владеешь основами HTML и CSS и готов двигаться дальше.";
    } else if (percent >= 70) {
      title.textContent = "Тест пройден!";
      message.textContent = "Хорошая база. Повтори вопросы с ошибками и переходи к своему проекту.";
    } else {
      title.textContent = "Продолжай практиковаться";
      message.textContent = "Вернись к урокам HTML и CSS, а затем попробуй пройти тест ещё раз.";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.getElementById("start-quiz").addEventListener("click", () => {
    intro.hidden = true;
    quizCard.hidden = false;
    showQuestion();
  });

  nextButton.addEventListener("click", () => {
    if (!answered) return;
    if (questionIndex < quizData.length - 1) {
      questionIndex += 1;
      showQuestion();
    } else {
      showResult();
    }
  });

  document.getElementById("restart-quiz").addEventListener("click", () => {
    questionIndex = 0;
    score = 0;
    resultCard.hidden = true;
    quizCard.hidden = false;
    showQuestion();
  });
}
