import getData from "dataFetcher"
import startQuiz from "quizEngine"

// Parsed Quiz Data
const QUIZ_DATA = await getData('./data/data.json')

// Elements
const quizScreen = document.getElementById("display")
const progressFill = document.querySelector(".progress-fill")

// Renders
const updateProgress = (index) => {
    const current = index + 1 // 1-based
    const total = QUIZ_DATA.questions.length
    const pct = (current / total) * 100
    progressFill.style.width = pct + "%"
}

const renderQuiz = ({question, index}) => {
    const opts = question.options.map(opt => `
            <div class="option" data-id="${opt.id}">
                ${opt.text}
            </div>
        `).join("")

    const backBtnState = index === 0 ? 'disabled' : ''

    quizScreen.innerHTML = `
        <div class="question">
            <div class="question-text">${question.text}</div>
                <div class="question-options">
                    ${opts}
                </div>
            <button class="btn btn-primary" id="backBtn" ${backBtnState}>Back</button>
        </div>
    `
    updateProgress(index)
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
const initQuiz = (data) => {
  if (!data) return null

  document.title = data.title
  document.getElementById('quiz-title').textContent = data.header
  console.log('App Ready!')

  return startQuiz(data, renderQuiz, renderResult)
}

const quiz = initQuiz(QUIZ_DATA)

// Event Manager
quizScreen.addEventListener('click', (e) => {
    const id = e.target.id
    const dataId = e.target.dataset.id

    if (id !== 'backBtn' && !dataId) return
    if (dataId) quiz?.answer(dataId)
    if (id) quiz?.goBack()
})

// Freeze test
// console.log(Object.isFrozen(QUIZ_DATA)) 
// QUIZ_DATA.questions[0].options[0].scores.PERF = 100