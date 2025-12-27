const startQuiz = (QUIZ_DATA, renderQuiz, renderResult) => {

    const values = {
        currentQIndex: 0,
        question: null,
        questionId: null,
        questionText: null,
        optionsArr: null,
        optionsIds: null,
    }

    const answerCache = []
    const scoreCard = QUIZ_DATA.traits.reduce((obj, item) => {
        obj[item] = 0
        return obj
    }, {})

    const update = () => {
        values.question = QUIZ_DATA.questions[values.currentQIndex]
        values.questionId = values.question.id
        values.questionText = values.question.text
        values.optionsArr = values.question.options
        values.optionsIds = values.optionsArr.map(opt => opt.id)
        renderQuiz(values.question)
    }

    const next = () => {
        if (values.currentQIndex >= QUIZ_DATA.questions.length - 1) return false
        values.currentQIndex++, update()
        return true
    }

    const answer = (opt=null) => {
        if (!next()) { renderResult(QUIZ_DATA.results[0]) }
    }

    update()
    
    return { answer }




    // const prev = () => {
    //     if (values.currentQIndex <= 0) return
    //     values.currentQIndex--, update()
    // }

    // const get = v => values[v]


    


    
    // return {next, prev, get}
}

export default startQuiz