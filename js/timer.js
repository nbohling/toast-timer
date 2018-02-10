// Some globals for the app
var myTimer = false;
var startedTime = 0;
var elapsedTime = 0; //Date.now();
var currentInterval = 0;
var time1 = 60;
var time2 = 30;
var transitionTime = 500;

// Color definitions. Change color scheme by adjusting these.
var gray = "#334141"
var green = "#66B464";
var yellow = "#FABC3C";
var red = "#FF5B2D";
var black = "#000000"

// Setup when document loaded.
$(document).ready(function() {
  reset();
  $(".gray").animate({color: gray}, transitionTime);
  $(".green").animate({color: green}, transitionTime);
  $(".yellow").animate({color: yellow}, transitionTime);
  $(".red").animate({color: red}, transitionTime);
  $(".black").animate({color: black}, transitionTime);

  // Setup controller for key strokes
  $(document).keypress(function(event) {
    console.log("Pressed: "+event.which);
    switch(event.which) {
      case 13: // Enter
        timerToggle(true);
        break;
      case 32: // Space
        timerToggle(false);
        break;
      case 61: // =
      case 43: // +
        if(time1<15) time1 = time1 + 5;
        else time1 = time1 + 15;
        break;
      case 45: // -
        if(time1 <= 15) time1 = time1 - 5;
        else time1 = time1 - 15;

        if(time1<5) time1 = 5;
        break;
      case 93: // [
        if(time2<15) time2 = time2 + 5;
        else time2 = time2 + 15;
        break;
      case 91: // ]
        if(time2 <= 15) time2 = time2 - 5;
        else time2 = time2 - 15;

        if(time2 < 5) time2 = 5;
        break;
      case 63: // ?
        $("#help_page").fadeToggle(transitionTime);
        break;
      case 114: // r - reset
        reset();
        break;
      case 48: // 0 - shorted preset
        time1 = 5;
        time2 = 5;
        break;
      case 49: // 1
        time1 = 60;
        time2 = 30;
        break;
      case 50: // 2
        time1 = 3*60;
        time2 = 60;
        break;
      case 120: // x
        $("#timer").fadeToggle();
        break;
    }
    updateIntervals();
  })
});

// Toggles whether timer is running or not
// Reset indicates whether to start from zero or continue from last time
function timerToggle(reset) {
  if( myTimer ) stopTimer();
  else startTimer(reset);
}

// Starts the timer event loop
function startTimer(reset) {
  //$(".indicator").animate({backgroundColor: "green"}, 1transitionTime);
  if(reset) {
    $(".indicator").animate({backgroundColor: gray}, transitionTime);
    startedTime = Date.now();
    currentInterval = 0;
  } else {
    startedTime = Date.now() - elapsedTime;
  }
  myTimer = setInterval(updateTimer, 25);
}

// Stops the timer event loop
function stopTimer() {
  //elapsedTime = Date.now() - startedTime;
  window.clearInterval(myTimer);
  myTimer = false;
  console.log("Stopped");
}

// Updates the timer display
function updateTimer() {
  if(myTimer) elapsedTime = Date.now() - startedTime

  ms = elapsedTime;
  m = Math.floor(ms / (1000 * 60));
  ms = ms - (m*1000*60);
  s = Math.floor(ms / 1000);
  ms = ms - (s*1000);
  ds = Math.floor(ms/100);

  timeString = ""+m + ":" + ensure2Digits(s) + "." + ds;
  $("#timer").text(timeString);

  // See if we jumped over a barrier
  if( currentInterval != 0 && s >= 0 && s < time1 ) {
    $(".indicator").animate({backgroundColor: gray}, transitionTime);
    currentInterval = 0;
  }
  if( currentInterval != 1 && s >= time1 && s < time1 + time2 ) {
    $(".indicator").animate({backgroundColor: green}, transitionTime);
    currentInterval = 1;
  } else if( currentInterval != 2 && s >= time1 + time2 && s < time1 + (time2*2) ) {
    $(".indicator").animate({backgroundColor: yellow}, transitionTime);
    currentInterval = 2;
  } else if( currentInterval != 3 && s >= time1 + (time2*2) && s < time1 + (time2*3) ) {
    $(".indicator").animate({backgroundColor: red}, transitionTime);
    currentInterval = 3;
  } else if( currentInterval != 4 && s >= time1 + (time2*3) ) {
    $(".indicator").animate({backgroundColor: black}, transitionTime);
    currentInterval = 4;
  }
}

// Updates the interval displays
function updateIntervals() {
  if(time1 >= 60) {
    $("#stop1").text(time1/60);
    $("#stop2").text((time1+time2)/60);
    $("#stop3").text((time1+(time2*2))/60);
    $("#stop4").text((time1+(time2*3))/60);
    $("#units").text("min");
  } else {
    $("#stop1").text(time1);
    $("#stop2").text(time1+time2);
    $("#stop3").text(time1+(time2*2));
    $("#stop4").text(time1+(time2*3));
    $("#units").text("sec");
  }
  updateTimer();
}

// Resets everything and stops any active timers.
function reset() {
  $(".indicator").animate({backgroundColor: gray}, transitionTime);
  currentInterval = 0;
  if( myTimer ) stopTimer();
  startedTime = Date.now();
  elapsedTime = 0;
  updateTimer();
  updateIntervals();
}

// Helper function to ensure 2 digits on a number.
function ensure2Digits(number) {
  if( number < 10 ) return "0"+number;
  else return number;
}
