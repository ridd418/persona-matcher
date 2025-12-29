// Quiz Factory
const startQuiz = (QUIZ_DATA, onQuestionChange, onQuizComplete) => {

    // Instance Variables
    const state = {
        index: 0,
        question: null,
        optionsArr: null,
    }

    const answerCache = []
    const scoreCard = QUIZ_DATA.traits.reduce((obj, item) => {
        obj[item] = 0
        return obj
    }, {})

    // Helper Functions
    const update = () => {
        state.question = QUIZ_DATA.questions[state.index]
        state.optionsArr = state.question.options

        onQuestionChange({ index : state.index, question : state.question })
    }

    const next = () => {
        if (state.index >= QUIZ_DATA.questions.length - 1) return false
        state.index++, update()
        return true
    }

    const prev = () => {
        if (state.index <= 0) return false
        state.index--, update()
        return true
    }

    // Methods
    const answer = (opt) => {
        const selected = state.optionsArr.find(item => item.id === opt)
        if (!selected) return

        const optionScores = selected.scores || {}
        Object.keys(optionScores).forEach(trait => {
            if (!(trait in scoreCard)) scoreCard[trait] = 0
            scoreCard[trait] += optionScores[trait]
        })

        answerCache.push(optionScores)
        // console.log(optionScores, scoreCard)

        if (next()) return

        const highestTrait = Object.keys(scoreCard).reduce((highest, current) =>
            scoreCard[current] > scoreCard[highest] ? current : highest
        )
        // console.log(highestTrait)
        const result = QUIZ_DATA.results.find(item => item.primaryTrait === highestTrait) || QUIZ_DATA.results[0]
        onQuizComplete(result)
    }

    const goBack = () => {
        const lastScores = answerCache.pop()
        if (!lastScores) return

        Object.keys(lastScores).forEach(trait => {
            scoreCard[trait] -= lastScores[trait]
        }), prev()
        // console.log(lastScores, answerCache, scoreCard)
    }

    // Instance Init
    update()
    
    return { answer, goBack }
}

export default startQuiz