function ObjectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function typeitAnswers( quizState ) {
    var allQuestionAnswers = quizState.quizData.questionData[0].answers

    var numQuestions = ObjectLength(allQuestionAnswers)

    for (i=1; i <= numQuestions; i++) {
        questionAnswer = allQuestionAnswers[i][0]

        $(`#typeItAnswer${i}`).val(questionAnswer["answer"]).change()
    }

    manageCheckButton()
    $("#activityCanvas > button[type='submit']").click()
}

function gapfillAnswers( quizState ) {
    var allQuestionAnswers = quizState.quizData.questionData[0].answers

    var numQuestions = ObjectLength(allQuestionAnswers)

    for (i=1; i <= numQuestions; i++) {
        questionAnswers = allQuestionAnswers[i]

        var numQuestionChoices = ObjectLength(questionAnswers)

        var correctChoiceHash = ""

        for (o=0; o <= numQuestionChoices - 1; o++) {
            if (questionAnswers[o].type == "correct") {
                correctChoiceHash = questionAnswers[o].hashedID
                $(`select[name="${i}"]`).val(correctChoiceHash).change()
            }
        }
        
        console.log(`${i}: ${correctChoiceHash}`)
    }
    manageCheckButton()
    $("#activityCanvas > button").click()
}

var quizState = JSON.parse($("input[name=quizState][value!=null]").attr("value"))

var quizType = quizState.type

switch(quizType) {
    case "typeit":
        typeitAnswers(quizState)
        break
    case "gapfill":
        gapfillAnswers(quizState)
        break

}