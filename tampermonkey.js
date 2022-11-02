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

      }

  }
}

$(function(){
  $("head").append(`<script>function completeExercise() {
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
  
            $(\`#typeItAnswer\${i}\`).val(questionAnswer.answer).change()
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
                    $(\`select[name="\${i}"]\`).val(correctChoiceHash).change()
                }
            }
        }
        manageCheckButton()
        // $("#activityCanvas > button[type='submit']").click()
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
  
        }
  
    }
  }</script>`)
  $("#navbarNavDropdownStudent > ul.navbarRightList").append(`<li class="navbarListItem"><a id="answerCompleteButton" class="navbarLink">Fill Answers</a></li>`)


  $("#answerCompleteButton").on("click", function() {
      completeExercise()
  })
})

