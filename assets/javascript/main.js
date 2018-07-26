$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBxnWcXiTEFpdGs3P5Th2VWFhtBWqWQw2k",
    authDomain: "train-schedule-d0387.firebaseapp.com",
    databaseURL: "https://train-schedule-d0387.firebaseio.com",
    projectId: "train-schedule-d0387",
    storageBucket: "",
    messagingSenderId: "595890089480"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  
  // Initial Values
  var name         = "";
  var destination  = "";
  var firstRunTime = "";   // hh:mm
  var frequency    = "";
  var nextArrival  = "";
  var minutesAway  = "";
  
  // APPEND TRAIN
  const appendTrain = function(snap) {
    var trainDiv = $("<div>").addClass("row p-2 table-row")
    // var p = $("<p>").addClass("card-text col")
    console.log(snap);
    $("#trainTable").append(trainDiv);
    trainDiv.append($("<p>").addClass("card-text col").text(snap.name))
      .append($("<p>").addClass("card-text col").text(snap.destination))
      .append($("<p>").addClass("card-text col").text(snap.frequency))
      .append($("<p>").addClass("card-text col").text(nextArrival))
      .append($("<p>").addClass("card-text col").text(minutesAway));
  }
  
  // Events
  $(".submit-btn").on("click", function() {
    name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstRunTime = $("#firstTrainTime").val().trim();
    frequency = $("#frequency").val().trim();

    // Push to firebase
    database.ref().push({
      name: name,
      destination: destination,
      firstRunTime: firstRunTime,
      frequency: frequency
    });
  });

  // Firebase watcher
  database.ref().on("child_added", function(childSnapshot) {
    appendTrain(childSnapshot.val());
  });
  

});