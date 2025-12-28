import getData from "dataFetcher"
import startQuiz from "quizEngine"

// Parsed Quiz Data
const QUIZ_DATA = await getData('./data/data.json')

// Elements
const quizScreen = document.getElementById("display")
const progressFill = document.querySelector(".progress-fill")

// Renders
const updateProgress = (currentQIndex) => {
    const current = currentQIndex + 1 // 1-based
    const total = QUIZ_DATA.questions.length
    const pct = (current / total) * 100
    progressFill.style.width = pct + "%"
}

const renderQuiz = (question) => {
    const opts = question.options.map(opt => `
            <div class="option" data-id="${opt.id}">
                ${opt.text}
            </div>
        `).join("")

    const backBtnState = question.id === 'q1' ? 'disabled' : ''
    // const backBtnState = 'disabled'

    quizScreen.innerHTML = `
        <div class="question">
            <div class="question-text">${question.text}</div>
                <div class="question-options">
                    ${opts}
                </div>
            <button class="btn btn-primary" id="backBtn" ${backBtnState}>Back</button>
        </div>
    `
    updateProgress(QUIZ_DATA.questions.indexOf(question))
}

const renderResult = (result) => {
    quizScreen.innerHTML = `
        <h2>Your Persona:</h2>
        <p>${result.text}</p>
        <h3>Recommended Types:</h3>
        <p>${result.recommended}</p>
    `
    progressFill.parentElement.style.display = 'none'
}

// Initialization
document.title = QUIZ_DATA.title
document.getElementById('quiz-title').textContent = QUIZ_DATA.header
const quiz = startQuiz(QUIZ_DATA, renderQuiz, renderResult)
console.log('App Ready!')

// Event Manager
quizScreen.addEventListener('click', (e) => {
    const id = e.target.id
    const dataId = e.target.dataset.id

    if (id !== 'backBtn' && !dataId) return
    if (dataId) quiz.answer(dataId)
    if (id) quiz.goBack()
})