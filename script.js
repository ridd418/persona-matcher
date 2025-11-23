let currentQuestion = 0
let userScores = { PERF: 0, PORT: 0, BATT: 0, ECO: 0, PREM: 0 }
let userAnswers = {}

const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")

function renderQuestion() {
    const q = QUIZ_DATA.questions[currentQuestion]

    quizScreen.innerHTML = `
        <div class="question">
            <div class="question__text">${q.text}</div>
            <div class="question__options">
                ${q.options.map(opt => `
                    <div class="option" data-id="${opt.id}">
                        ${opt.text}
                    </div>
                `).join("")}
            </div>
            <button class="btn btn--primary" id="nextBtn">Next</button>
        </div>
    `
}

renderQuestion()