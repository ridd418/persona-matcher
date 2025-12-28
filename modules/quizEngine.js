const startQuiz = (QUIZ_DATA, renderQuiz, renderResult) => {

    const values = {
        currentQIndex: 0,
        question: null,
        optionsArr: null,
    }

    const answerCache = []
    const scoreCard = QUIZ_DATA.traits.reduce((obj, item) => {
        obj[item] = 0
        return obj
    }, {})

    const update = () => {
        values.question = QUIZ_DATA.questions[values.currentQIndex]
        values.optionsArr = values.question.options

        renderQuiz(values.question)
    }

    const next = () => {
        if (values.currentQIndex >= QUIZ_DATA.questions.length - 1) return false
        values.currentQIndex++, update()
        return true
    }

    const prev = () => {
        if (values.currentQIndex <= 0) return false
        values.currentQIndex--, update()
        return true
    }

    const answer = (opt) => {
        const selected = values.optionsArr.find(item => item.id === opt)
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
        renderResult(result)
    }

    const goBack = () => {
        const lastScores = answerCache.pop()
        if (!lastScores) return

        Object.keys(lastScores).forEach(trait => {
            scoreCard[trait] -= lastScores[trait]
        }), prev(), update()
        // console.log(lastScores, answerCache, scoreCard)
    }

    update()
    
    return { answer, goBack}
}

export default startQuiz