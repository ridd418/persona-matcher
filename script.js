let currentQuestion = 0
let userScores = { PERF: 0, PORT: 0, BATT: 0, ECO: 0, PREM: 0 }
let userAnswers = {}

const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")

// import {QUIZ_DATA} from './quiz-data.js'
// import QUIZ_DATA from './quiz-data.js'

const getData = async () => {
    try {
    const res = await fetch('./data.json')
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    // console.log(data)
    return data
    } catch (err) {
    console.error('Failed to load quiz data:', err)
    }
}

// const getData = async () => {
//     if (location.protocol.startsWith('http')) {
//         try {
//             const res = await fetch('./dat.json')
//             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
//             const data = await res.json()
//             // console.log(data)
//             return data
//         } catch (err) {
//             console.warn('Failed to load quiz data:', err)
//             // console.log('Loading from JS module!')
//             // const module = await import('./quiz-data.js')
//             // console.log(module.QUIZ_DATA)
//             // return module.QUIZ_DATA
//         }
//     }
//     data = await import('./quiz-data.js')
//     console.log(data.QUIZ_DATA)
//     return data.QUIZ_DATA
// }

const QUIZ_DATA = await getData()

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