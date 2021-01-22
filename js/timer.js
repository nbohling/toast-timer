// Some globals for the app
let myTimer = false;
let startedTime = 0;
let elapsedTime = 0;
let currentInterval = 0;
let first_time = 60;
let interval_time = 30;
let transitionTime = 500;
let history = [];

// Color definitions. Change color scheme by adjusting these.
const gray = "#334141";
const green = "#66B464";
const yellow = "#FABC3C";
const red = "#FF5B2D";
const black = "#000000";
const white = "#FFF";

// Setup when document loaded.
$(function() {
  reset();
  $(".gray").animate({ color: gray }, transitionTime);
  $(".green").animate({ color: green }, transitionTime);
  $(".yellow").animate({ color: yellow }, transitionTime);
  $(".red").animate({ color: red }, transitionTime);
  $(".black").animate({ color: black }, transitionTime);
  blink_green("#controls");

  // Set up the control panel
  // Slider for first notification time
  $(".int_slider_start").slider({
    min: 30,
    max: 10 * 60,
    value: 60,
    step: 15,
    slide: (event, ui) => {
      first_time = ui.value;
      updateIntervals();
    },
  });

  // Slider for interval between notifications
  $(".int_slider_between").slider({
    min: 15,
    max: 5 * 60,
    step: 15,
    value: 30,
    slide: (event, ui) => {
      interval_time = ui.value;
      updateIntervals();
    },
  });

  // Start/Stop button
  $("button.start_stop")
    .button()
    .click(() => {
      timerToggle(false);
    });

  // Reset button
  $("button.reset")
    .button()
    .click(() => {
      reset();
    });

  $("button.preset_speaker")
    .button()
    .click(() => {
      first_time = 4 * 60;
      interval_time = 60;
      updateIntervals();
    });

  $("button.preset_table_topics")
    .button()
    .click(() => {
      first_time = 1 * 60;
      interval_time = 30;
      updateIntervals();
    });

  // Setup controller for key strokes
  $(document).keypress(function(event) {
    console.log("Pressed: " + event.which);
    switch (event.which) {
      case 13: // Enter
        if (event.target.nodeName != "BUTTON") timerToggle(true);
        break;
      case 32: // Space
        if (event.target.nodeName != "BUTTON") timerToggle(false);
        break;
      case 61: // =
      case 43: // +
        if (first_time < 15) first_time = first_time + 5;
        else first_time = first_time + 15;
        break;
      case 45: // -
        if (first_time <= 15) first_time = first_time - 5;
        else first_time = first_time - 15;

        if (first_time < 5) first_time = 5;
        break;
      case 93: // [
        if (interval_time < 15) interval_time = interval_time + 5;
        else interval_time = interval_time + 15;
        break;
      case 91: // ]
        if (interval_time <= 15) interval_time = interval_time - 5;
        else interval_time = interval_time - 15;

        if (interval_time < 5) interval_time = 5;
        break;
      case 63: // ?
        $("#help_page").fadeToggle(transitionTime);
        break;
      case 114: // r - reset
        reset();
        break;
      case 48: // 0 - shortest preset
        first_time = 5;
        interval_time = 5;
        break;
      case 49: // 1
        first_time = 60;
        interval_time = 30;
        break;
      case 50: // 2
        first_time = 2 * 60;
        interval_time = 30;
        break;
      case 51: // 3
        first_time = 3 * 60;
        interval_time = 60;
        break;
      case 52: // 4
        first_time = 4 * 60;
        interval_time = 60;
        break;
      case 53: // 5
        first_time = 5 * 60;
        interval_time = 60;
        break;
      case 99: // c
        $("#control_panel").fadeToggle();
        break;
      case 120: // x
        //$('#timer').fadeToggle();
        $("#controls").fadeToggle();
        $("#footer").fadeToggle();
        break;
    }
    updateIntervals();
  });

  // Toggles whether timer is running or not
  // Reset indicates whether to start from zero or continue from last time
  function timerToggle(reset) {
    if (myTimer) stopTimer();
    else startTimer(reset);
  }

  // Starts the timer event loop
  function startTimer(reset) {
    //$(".indicator").animate({backgroundColor: "green"}, 1transitionTime);
    if (reset) {
      // Store off the history event
      addHistory();

      $(".indicator").animate({ backgroundColor: gray }, transitionTime);
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

  // Updates the timer display including color and time value
  function updateTimer() {
    if (myTimer) elapsedTime = Date.now() - startedTime;

    ms = elapsedTime;
    sec = ms / 1000;
    m = Math.floor(ms / (1000 * 60));
    ms = ms - m * 1000 * 60;
    s = Math.floor(ms / 1000);
    ms = ms - s * 1000;
    ds = Math.floor(ms / 100);

    timeString = "" + m + ":" + ensure2Digits(s) + "." + ds;
    $("#timer").text(timeString);

    // Thresholds (in s)
    const threshold_green = first_time;
    const threshold_yellow = threshold_green + interval_time;
    const threshold_red = threshold_yellow + interval_time;
    const threshold_black = threshold_red + Math.min(interval_time, 30);

    // See if we jumped over a barrier
    if (currentInterval != 0 && sec >= 0 && sec < threshold_green) {
      $(".indicator").animate({ backgroundColor: gray }, transitionTime);
      currentInterval = 0;
    } else if (
      currentInterval != 1 &&
      sec >= threshold_green &&
      sec < threshold_yellow
    ) {
      $(".indicator").animate({ backgroundColor: green }, transitionTime);
      currentInterval = 1;
    } else if (
      currentInterval != 2 &&
      sec >= threshold_yellow &&
      sec < threshold_red
    ) {
      $(".indicator").animate({ backgroundColor: yellow }, transitionTime);
      currentInterval = 2;
    } else if (
      currentInterval != 3 &&
      sec >= threshold_red &&
      sec < threshold_black
    ) {
      $(".indicator").animate({ backgroundColor: red }, transitionTime);
      currentInterval = 3;
    } else if (currentInterval != 4 && sec >= threshold_black) {
      $(".indicator").animate({ backgroundColor: black }, transitionTime);
      currentInterval = 4;
    }
  }

  // Updates the interval numbers
  function updateIntervals() {
    if (first_time >= 60) {
      $(".int_stop1").text(toMinuteAndSeconds(first_time));
      $(".int_stop2").text(toMinuteAndSeconds(first_time + interval_time));
      $(".int_stop3").text(toMinuteAndSeconds(first_time + interval_time * 2));
      $(".int_stop4").text(
        toMinuteAndSeconds(
          first_time + interval_time * 2 + Math.min(interval_time, 30)
        )
      );
      $(".int_between").text(toMinuteAndSeconds(interval_time));
      $(".int_units").text("min");
    } else {
      $(".int_stop1").text(first_time);
      $(".int_stop2").text(first_time + interval_time);
      $(".int_stop3").text(first_time + interval_time * 2);
      $(".int_stop4").text(
        first_time + interval_time * 2 + Math.min(interval_time, 30)
      );
      $(".int_units").text("sec");
      $(".int_between").text(interval_time);
    }
    updateTimer();
    // Try to update the sliders
    try {
      $(".int_slider_start").slider("value", first_time);
      $(".int_slider_between").slider("value", interval_time);
    } catch (error) {
      console.log("Slider isn't ready.");
    }
  }

  // Convert seconds to a string that represents minutes and seconds
  function toMinuteAndSeconds(seconds) {
    if (seconds < 60) return "0:" + ensure2Digits(seconds);
    else {
      minutes = Math.floor(seconds / 60);
      seconds2 = seconds - minutes * 60;
      return minutes + ":" + ensure2Digits(seconds2);
    }
  }

  // Resets everything and stops any active timers.
  function reset() {
    addHistory();
    // Reset to gray
    $(".indicator").animate({ backgroundColor: gray }, transitionTime);
    currentInterval = 0;
    if (myTimer) stopTimer();
    startedTime = Date.now();
    elapsedTime = 0;
    updateTimer();
    updateIntervals();
  }

  function addHistory() {
    if (elapsedTime == 0) return;

    let timeString = toMinuteAndSeconds(Math.floor(elapsedTime / 100) / 10);

    history.push(timeString);
    if (history.length > 10) history.shift();

    // update the UI
    let historyBox = $("#history_list");
    historyBox.find(".history_entry").remove();
    // Add new entries
    history.forEach(element => {
      historyBox.append(`<li class="history_entry">${element}</li>`);
    });
  }

  // Helper function to ensure 2 digits on a number.
  function ensure2Digits(number) {
    if (number < 10) return "0" + number;
    else return number;
  }

  // Alternate between green and red
  function blink_green(selector) {
    blink = 6;
    intID = window.setInterval(function() {
      if (blink % 2 == 0) $(selector).animate({ color: green }, 300);
      else $(selector).animate({ color: white }, 300);
      if (--blink == 0) window.clearInterval(intID);
    }, 500);
  }
});
