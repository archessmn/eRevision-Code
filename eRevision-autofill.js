// ==UserScript==
// @name         Auto-Answer eRevision
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-answers eRevision questions
// @author       archessmn
// @match        https://erevision.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erevision.uk
// @grant        none
// @require      https://erevision.uk/js/Shared/jquery-3.4.1.min.js

// ==/UserScript==






function completeExercise() {
    const fileURL = "https://cdn.jsdelivr.net/gh/archessmn/eRevision-Code/script.js"

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

        var i

        for (i=1; i <= numQuestions; i++) {
            var questionAnswer = allQuestionAnswers[i][0]

            $(`#typeItAnswer${i}`).val(questionAnswer.answer).change()
        }

        manageCheckButton()
        // $("#activityCanvas > button[type='submit']").click()
    }

    function gapfillAnswers( quizState ) {
        var allQuestionAnswers = quizState.quizData.questionData[0].answers

        var numQuestions = ObjectLength(allQuestionAnswers)

        var i

        for (i=1; i <= numQuestions; i++) {
            var questionAnswers = allQuestionAnswers[i]

            var numQuestionChoices = ObjectLength(questionAnswers)

            var correctChoiceHash = ""
            var o

            for (o=0; o <= numQuestionChoices - 1; o++) {
                if (questionAnswers[o].type == "correct") {
                    correctChoiceHash = questionAnswers[o].hashedID
                    $(`select[name="${i}"]`).val(correctChoiceHash).change()
                }
            }
        }
        manageCheckButton()
        // $("#activityCanvas > button[type='submit']").click()
    }

    function multiplechoiceAnswers( quizState ) {
        
        function selectAnswer() {
            var quizState = JSON.parse($("input[name=quizState][value!=null]").attr("value"))
            var allCurrentQuestionAnswers = quizState.quizData.questionData.answers
            var numQuestionAnswers = ObjectLength(allCurrentQuestionAnswers)

            for (o=0; o <= numQuestionAnswers - 1; o++) {
                if (allCurrentQuestionAnswers[o].type == "correct") {
                    correctChoiceHash = allCurrentQuestionAnswers[o].hashedID
                }
            }

            $(`button[value="${correctChoiceHash}"]`).click()

        }

        function nextQuestion() {
            $(`button[name='moveToTheNextQuestion']`).click()
        }


        if ($(`button[name='moveToTheNextQuestion']`).length) {
            $(`button[name='moveToTheNextQuestion']`).click()
        }

        var quizState = JSON.parse($("input[name=quizState][value!=null]").attr("value"))

        var numQuestionsLeft = ObjectLength(quizState.unansweredQuestionIDs)

        if (numQuestionsLeft > 0) {
            // Select the target node.
            var target = document.querySelector('#ajaxCanvas')

            // Create an observer instance.
            var observer = new MutationObserver(function(mutations) {
                // If next question button exists
                if ($(`button[name='moveToTheNextQuestion']`).length) {
                    nextQuestion()
                } else {
                    // If there are more questions
                    if (numQuestionsLeft != 0) {
                        selectAnswer()
                        numQuestionsLeft--
                    } else {
                        observer.disconnect()
                        console.log("Stopped Observing")
                    }
                }

                if (numQuestionsLeft == 0) {
                    observer.disconnect()
                    console.log("Stopped Observing")
                }
            });

            // Pass in the target node, as well as the observer options.
            observer.observe(target, {
                attributes:    true,
                childList:     true,
                characterData: true
            });

            selectAnswer()

        }
        
        


        // selectAnswer()
        
        // nextQuestion()

        

        

    }


    var quizStateString = $("input[name=quizState][value!=null]").attr("value")
    if (quizStateString != undefined) {
        var quizState = JSON.parse(quizStateString)
        var quizType = quizState.type

        switch(quizType) {
            case "typeit":
                typeitAnswers(quizState)
                break
            case "gapfill":
                gapfillAnswers(quizState)
                break
            case "multiplechoice":
                multiplechoiceAnswers(quizState)
                break

        } 

    }
}

$(function(){
//   $("head").append(`<script></script>`)
  $("#navbarNavDropdownStudent > ul.navbarRightList").append(`<li class="navbarListItem"><a id="answerCompleteButton" class="navbarLink">Fill Answers</a></li>`)


  $("#answerCompleteButton").on("click", function() {
      completeExercise()
  })
})

