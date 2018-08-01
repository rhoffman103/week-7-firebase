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
  const appendTrain = function(snap, minAway) {
    var trainBody = $("<tr>");

    $("tbody").append(trainBody);
    trainBody.append($("<th>").attr("scope", "col").text(snap.name))
    .append($("<th>").attr("scope", "col").text(snap.destination))
    .append($("<th>").attr("scope", "col").text(snap.frequency))
    .append($("<th>").attr({scope: "col", id: snap.name.replace(/\s/g, '-') + "-next-arrival"}).text(nextArrival))
    .append($("<th>").attr({scope: "col", id: snap.name.replace(/\s/g, '-') + "-minutes-away"}).text(minutesAway));
  };

  // GET NEXT ARRIVAL & MINUTES AWAY
  const getNextArrival = function(snap) {
    var currentTime = moment(); //.format("hh:mm");
    var firstTT = moment(snap.firstRunTime, "hh:mm");
    var duration = moment.duration(currentTime.diff(firstTT))
    var diff = currentTime.diff(firstTT, "minutes");
    var remainder = diff % snap.frequency; // minutes passed in current interval
    minutesAway = snap.frequency - remainder;
    nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
    minutesAway += ":" + (60 - duration._data.seconds);
    // console.log(snap)
  };

  // Updates next arrival and minutes away
  function update() {
    database.ref().on("child_added", function(childSnapshot) {
      getNextArrival(childSnapshot.val());
      var attrName = childSnapshot.val().name.replace(/\s/g, '-');
      $("#" + attrName + "-next-arrival").text(nextArrival);
      $("#" + attrName + "-minutes-away").text(minutesAway);
    })
  };
  
  setInterval(update, 1000);
  
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
    getNextArrival(childSnapshot.val());
    appendTrain(childSnapshot.val());

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  
});