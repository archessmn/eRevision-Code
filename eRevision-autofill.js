// ==UserScript==
// @name         Auto-Answer eRevision
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-answers eRevision questions
// @author       archessmn
// @match        https://erevision.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erevision.uk
// @grant        none
//      https://raw.githubusercontent.com/threedubmedia/jquery.threedubmedia/master/event.drag/jquery.event.drag.js
//      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js
//      https://rawgit.com/jquery/jquery-ui/1-11-stable/external/jquery-simulate/jquery.simulate.js

// ==/UserScript==






function completeExercise() {

    function ObjectLength( object ) {
        var length = 0;
        for( var key in object ) {
            if( object.hasOwnProperty(key) ) {
                ++length;
            }
        }
        return length;
    };

    function dragAtoB(A, B) {
        var draggable = $(A).draggable(),
            droppable = $(B).droppable(),

            droppableOffset = droppable.offset(),
            draggableOffset = draggable.offset(),
            dx = droppableOffset.left - draggableOffset.left,
            dy = droppableOffset.top - draggableOffset.top;
    
        draggable.simulate("drag", {
            dx: dx + 20,
            dy: dy + 20
        });
    }


    function typeitAnswers( quizState ) {
        var allQuestionAnswers = quizState.quizData.questionData[0].answers

        var numQuestions = ObjectLength(allQuestionAnswers)

        var i

        for (i=1; i <= numQuestions; i++) {
            var questionAnswer = allQuestionAnswers[i][0]

            $(`#typeItAnswer${i}`).val(questionAnswer.answer).change()
        }

        manageCheckButton()
        $("#activityCanvas > button[type='submit']").click()
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
        $("#activityCanvas > button[type='submit']").click()
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

    function categoriseAnswers(quizState) {
        var allQuestionAnswers = quizState.quizData.questionData

        for (o=0; o < ObjectLength(allQuestionAnswers.answers); o++) {

            answer = allQuestionAnswers.answers[o]
            correctCategory = {}

            for (i = 0; i < ObjectLength(allQuestionAnswers.categories); i++) {
                if (allQuestionAnswers.categories[i].ID == answer.categoryID) {
                    correctCategory = allQuestionAnswers.categories[i]
                    break
                }
            }

            dragAtoB(`#${answer.hashedID}`, `#${correctCategory.hashedID}`)

            $(`#${answer.hashedID}`).appendTo($(`#${correctCategory.hashedID}`))
        }

        setTimeout(function(){
            manageCheckButton();
            $("#activityCanvas > button[type='submit']").click()
        }, 1000);

    }

    function matchUpAnswers(quizState) {

        console.log("Solving Match Up")

        var allQuestionAnswers = quizState.quizData.questionData

        for (o=0; o < ObjectLength(allQuestionAnswers); o++) {

            answerID = allQuestionAnswers[o].hashedID
            questionID = allQuestionAnswers[o].ID

            dragAtoB(`#${answerID}`, `#${questionID}`)

            $(`#matchupQuestions #${answerID}`).remove()
            $(`#${answerID}`).appendTo($(`#${questionID}`))
        }

        setTimeout(function(){
            manageCheckButton();
            $("#activityCanvas > button[type='submit']").click()
        }, 1000);
    }

    function pindropAnswers(quizState) {
        var allQuestionAnswers = quizState.quizData.questionData.labels

        for (o=0; o < ObjectLength(allQuestionAnswers); o++) {

            answerID = allQuestionAnswers[o].hashedID
            questionID = allQuestionAnswers[o].ID

            dragAtoB(`#${answerID}`, `#${questionID}`)

            $(`#matchupQuestions #${answerID}`).remove()
            $(`#${answerID}`).appendTo($(`#${questionID}`))
        }

        setTimeout(function(){
            manageCheckButton();
            $("#activityCanvas > button[type='submit']").click()
        }, 1000);
    }

    var quizStateString = $("input[name=quizState][value!=null]").attr("value")
    if (quizStateString != undefined) {
        var quizState = JSON.parse(quizStateString)
        var quizType = quizState.type

        console.log(quizType)

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
            case "categorise":
                categoriseAnswers(quizState)
                break
            case "matchup":
                matchUpAnswers(quizState)
                break
            case "pindrop":
                pindropAnswers(quizState)
                break
            default:
                window.alert("This task doesn't yet support filling answers, you can create an issue at https://github.com/archessmn/eRevision-Code/issues")
        } 

    }
}

$(function(){
//   $("head").append(`<script src="https://i.archessmn.xyz/scripts/eRevision-autofill.js"></script>`)
    var quizStateString = $("input[name=quizState][value!=null]").attr("value")
    if (quizStateString != undefined) {
        $("#navbarNavDropdownStudent > ul.navbarRightList").append(`<li class="navbarListItem"><a id="answerCompleteButton" class="navbarLink">Fill Answers</a></li>`)

        $("head").append(`<script src="https://raw.githubusercontent.com/threedubmedia/jquery.threedubmedia/master/event.drag/jquery.event.drag.js"></script>`)
        $("head").append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>`)
        $("head").append(`<script src="https://rawgit.com/jquery/jquery-ui/1-11-stable/external/jquery-simulate/jquery.simulate.js"></script>`)

        
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js
// @require      https://rawgit.com/jquery/jquery-ui/1-11-stable/external/jquery-simulate/jquery.simulate.js

        $("#answerCompleteButton").on("click", function() {
            completeExercise()
        })

        var quizState = JSON.parse(quizStateString)
        var quizType = quizState.type

        // if (quizType == "pindrop") {
        //     $(".pindropLabel").on("click", function(e) {

        //         function ObjectLength( object ) {
        //             var length = 0;
        //             for( var key in object ) {
        //                 if( object.hasOwnProperty(key) ) {
        //                     ++length;
        //                 }
        //             }
        //             return length;
        //         };

        //         if (e.shiftKey) {
        //             var allQuestionAnswers = quizState.quizData.questionData.labels

        //             answerID = $(this).attr("id")

        //             console.log(answerID)

        //             questionID = ""
        //             for (i = 0; i < ObjectLength(allQuestionAnswers); i++) {
        //                 if (allQuestionAnswers[i].hashedID == answerID) {
        //                     questionID = allQuestionAnswers[i].ID
        //                     break
        //                 }
        //             }

        //             var draggable = $(`#${answerID}`).draggable(),
        //                 droppable = $(`#${questionID}`).droppable(),

        //                 droppableOffset = droppable.offset(),
        //                 draggableOffset = draggable.offset(),
        //                 dx = droppableOffset.left - draggableOffset.left,
        //                 dy = droppableOffset.top - draggableOffset.top;
                
        //             draggable.simulate("drag", {
        //                 dx: dx + 20,
        //                 dy: dy + 20
        //             });
        //             $(`#matchupQuestions #${answerID}`).remove()
        //             $(`#${answerID}`).appendTo($(`#${questionID}`))

        //             setTimeout(function(){
        //                 manageCheckButton();
        //             }, 1000);
        //         }

        //         setTimeout(function(){
        //             manageCheckButton();
        //         }, 1000);

        //     })
        // }
    }
})

