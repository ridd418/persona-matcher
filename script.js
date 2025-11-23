const getData = async () => {
    try {
        console.log('Loading quiz data...')
        const res = await fetch('./data.json')
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        console.log('Quiz data loaded.')
        return data
    } catch (err) {
        console.error('Failed to load quiz data:', err)
    }
}

const QUIZ_DATA = await getData()
console.log('App Ready!')

const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")

// const cardBuild = arr => {
//     const obj = {}
//     arr.forEach(e => {
//         obj[e] = 0
//     })
//     return obj
// }

const Question = () => {
    const values = {
        currentQIndex: 0,
        question: null,
        questionId: null,
        questionText: null,
        optionsArr: null,
        optionsIds: null,
    }

    const update = () => {
        values.question = QUIZ_DATA.questions[values.currentQIndex]
        values.questionId = values.question.id
        values.questionText = values.question.text
        values.optionsArr = values.question.options
        values.optionsIds = values.optionsArr.map(opt => opt.id)
    }
    update()

    const next = () => {
        if (values.currentQIndex >= QUIZ_DATA.questions.length - 1) return false
        values.currentQIndex++, update()
        return true
    }
    const prev = () => {
        if (values.currentQIndex <= 0) return
        values.currentQIndex--, update()
    }

    const get = v => values[v]
    
    return {next, prev, get}
}

const Answers = () => {
    const answerCache = []
    const scoreCard = QUIZ_DATA.traits.reduce((obj, item) => {
        obj[item] = 0 
        return obj
    }, {})

    const showResult = () => {
        const highestTrait = Object.keys(scoreCard).reduce((highest, current) => scoreCard[current] > scoreCard[highest] ? current : highest)
        const result = QUIZ_DATA.results.find(item => item.primaryTrait === highestTrait)
        resultScreen.innerHTML = `
            <h2>Your Laptop Persona</h2>
            <p>${result.text}</p>
            <h3>Recommended Types:</h3>
            <p>${result.recommended}</p>
        `
        // console.log(highestTrait)
        quizScreen.classList.add('hidden')
        resultScreen.classList.remove('hidden')
    }

    const answered = opt => {
        const optionScores = Q.get('optionsArr').find(item => item.id === opt).scores

        answerCache.push(optionScores)
        Object.keys(optionScores).forEach(trait => {
            scoreCard[trait] += optionScores[trait]
        })
        if (Q.next()) renderQuestion()
        else showResult()
        // console.log(answerCache, scoreCard)
    
    }

    const goBack = () => {
        const lastScores = answerCache.pop()
        if (!lastScores) return

        Object.keys(lastScores).forEach(trait => {
            scoreCard[trait] -= lastScores[trait]
        }), Q.prev(), renderQuestion()
        // console.log(answerCache, scoreCard)
    }

    return {answered, goBack}
}

const Q = Question()
const A = Answers()

const renderQuestion = () => {
    const opts = Q.get('optionsArr').map(opt => `
            <div class="option" data-id="${opt.id}">
                ${opt.text}
            </div>
        `).join("")

    const backBtnDisabled = Q.get('currentQIndex') === 0 ? 'disabled' : ''

    quizScreen.innerHTML = `
         <div class="question">
            <div class="question__text">${Q.get('questionText')}</div>
                <div class="question__options">
                ${opts}
                </div>
                <button class="btn btn--primary" id="backBtn" ${backBtnDisabled}>Back</button>
            </div>
        </div>
    `
}

quizScreen.addEventListener('click', (e) => {
    const id = e.target.id
    const dataId = e.target.dataset.id
    if (id !== 'backBtn' && !dataId) return
    if (id) A.goBack()
    if (Q.get('optionsIds').includes(dataId)) A.answered(dataId)
})

renderQuestion()