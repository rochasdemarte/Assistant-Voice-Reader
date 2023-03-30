const synth = window.speechSynthesis;

const inputTxt = $(".txt");
const voiceSelect = $("select");

const textEl = $('#text-display');
const playEl = $('#play');
const pauseEl = $('#pause');
const stopEl = $('#stop');

const pitch = $("#pitch");
const pitchValue = $(".pitch-value");
const rate = $("#rate");
const rateValue = $(".rate-value");

let userDefaultVoice = -1;
let voices = [];
let tempText = '';

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });
  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} - ${voices[i].lang}`;

    if (voices[i].default) {
      userDefaultVoice = i;
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = userDefaultVoice > -1 ? userDefaultVoice : selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function play() {
  if (synth.speaking) {
    synth.resume();
    console.log("Speech Synthesis Resumed");
    return;
  }

  if (inputTxt.value !== "") {
    tempText = inputTxt.value;
    const utterThis = new SpeechSynthesisUtterance(tempText);

    utterThis.addEventListener('start', handleStart);
    utterThis.addEventListener('pause', handlePause);
    utterThis.addEventListener('resume', handleResume);
    utterThis.addEventListener('end', handleEnd);
    utterThis.addEventListener('boundary', handleBoundary);

    const selectedOption =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.cancel();
    synth.speak(utterThis);
    console.log("Speech Synthesis Started");
    var r = setInterval(function () {
      console.log(synth.speaking);
      if (!synth.speaking) clearInterval(r);
      else synth.resume();
    }, 14000);
  }
}

function pause() {
  synth.pause();
  console.log("Speech Synthesis Paused");
}

function stop() {
  synth.cancel();
  console.log("Speech Synthesis Ended");
  handleEnd();
}

function handleStart() {
  playEl.disabled = true;
  pauseEl.disabled = false;
  stopEl.disabled = false;
}

function handlePause() {
  playEl.disabled = false;
  pauseEl.disabled = true;
  stopEl.disabled = false;
}

function handleResume() {
  playEl.disabled = true;
  pauseEl.disabled = false;
  stopEl.disabled = false;
}

function handleEnd() {
  playEl.disabled = false;
  pauseEl.disabled = true;
  stopEl.disabled = true;
  textEl.innerHTML = tempText;
}

function handleBoundary(event) {
  if (event.name === 'sentence') return;

  const wordStart = event.charIndex;
  let wordLength = event.charLength;

  if (wordLength === undefined) {
    const match = tempText.substring(wordStart).match(/^[a-z\d']*/i);
    wordLength = match[0].length;
  }

  const wordEnd = wordStart + wordLength;
  const word = tempText.substring(wordStart, wordEnd);
  const markedText = tempText.substring(0, wordStart) + '<mark>' + word + '</mark>' + tempText.substring(wordEnd);
  textEl.innerHTML = markedText;
}

playEl.onclick = function (event) {
  event.preventDefault();
  play();
  inputTxt.blur();
};

playEl.addEventListener('click', play);
pauseEl.addEventListener('click', pause);
stopEl.addEventListener('click', stop);

pitch.onchange = function () {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function () {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function () {
  play();
};
