import axios, * as others from 'axios';
import Msgs from './hangman_messages.js';
import {AnswerListProvider} from './hangman_answer.js';
import Utils from './utils.js';

export class HangmanModel {}

function wonHandler(input) {
  setPrompt("You Won! Type 'Y' to play again!");
  shouldPlayAgain(input);
}
function lostHandler(input) {
  setPrompt("You Lost! Type 'Y' to play again!");
  shouldPlayAgain(input);
}
function shouldPlayAgain(input) {
  if (input === 'y') {
    initGame();
    hmm.state = 'rhyme';
    setPrompt('Enter a rhyming word: ');
    setOutput('');
  } else if (input === 'n')
    setOutput(
      "Sorry you won't be playing again.\n Have a great day!  Bye now.\n"
    );
}
export function syllablesHandler(input, hmm) {
  let numSyl = parseInt(input);
  hmm.numSyllables = numSyl;
  if (input.trim() === '') return;
  if (!Utils.isNumeric(input)) return;
  if (!Utils.is_string_an_int_between(input, 1, numSyl)) return;
  let sylArrays = getMainRespAsSylArraysObject(hmm);
  let sylChoiceArray = trimListByNumSyl(sylArrays, numSyl);
  hmm.choice = Utils.choose(sylChoiceArray);
  console.log('hmm.choice: ', hmm.choice);
  for (var letter of hmm.choice) {
    if (letter === ' ') hmm.fullGuess.push(' ');
    else hmm.fullGuess.push('_');
  }
  //addOutputLn('answer: ' + hmm.choice);
  hmm.state = 'guess';
  //setPrompt('Guess a letter: ');
}

export async function rhymeHandler(input, hmm) {
  if (input.trim() === '') return;
  if (Utils.isNumeric(input)) return;
  if (!Utils.is_whole_word_alpha(input)) return;
  let response = await ap.getResponse(input);
  console.log(response);
  hmm.mainResponse = response;
  hmm.state = 'syllables';
  //setPrompt('syllables: ');
}

function getMainRespAsSylArraysObject(hmm) {
  let allSylsArray = getAllSylsArray(hmm);
  let sylChoicesArrays = getEmptySylChoicesArrayAsObject(allSylsArray);
  return getSylChoicesArraysAsObject(sylChoicesArrays);
  function getSylChoicesArraysAsObject(sylChoicesArraysAsObjects) {
    for (var wordGroup of hmm.mainResponse.data) {
      sylChoicesArraysAsObjects[wordGroup.numSyllables].push(wordGroup.word);
    }
    return sylChoicesArraysAsObjects;
  }
  function getEmptySylChoicesArrayAsObject(allSylsArray) {
    let sylChoicesArrays = {};
    let max = Math.max(...allSylsArray);
    for (var i = 1; i < max + 1; i++) {
      sylChoicesArrays[i] = [];
    }
    return sylChoicesArrays;
  }
  function getAllSylsArray(hmm) {
    let allSylsArray = [];
    for (var wordGroup of hmm.mainResponse.data) {
      allSylsArray.push(wordGroup.numSyllables);
    }
    return allSylsArray;
  }
}

function trimListByNumSyl(sylArrays, numSyl) {
  return sylArrays[numSyl];
}

export function mainGameLoop(guess) {
  let result;
  if (guess.trim() === '') return;
  if (Utils.isNumeric(guess)) return;
  if (!Utils.is_whole_word_alpha(guess)) return;
  let isCorrectGuess = false;
  let msg = '';
  for (var idx in hmm.choice) {
    if (guess === hmm.choice[idx]) {
      hmm.fullGuess[idx] = guess;
      isCorrectGuess = true;
      msg = 'Correct. Great Guess!';
    }
  }
  if (!isCorrectGuess) {
    hmm.wrongGuesses.push(guess);
    hmm.guessesRemaining -= 1;
    msg = "'" + guess + "' is wrong";
  }
  let output = Msgs.getHangmanDrawing(
    hmm.fullGuess.join(' '),
    msg,
    hmm.wrongGuesses,
    hmm.choice,
    hmm.guessesRemaining,
    hmm.numSyllables
  );
  setOutput(output);
  hmm.state = 'guess';
  setPrompt('Guess a letter: ');
  if (hmm.fullGuess.join('') === hmm.choice) {
    hmm.state = 'won';
    return;
  }
  if (hmm.guessesRemaining === 0) {
    hmm.state = 'lost';
    return;
  }
  //}
}

function initGame() {
  //hmm = new HangmanModel();
  hmm.fullGuess = [];
  hmm.choice = 'thisisatest';
  hmm.guessesRemaining = 6;
  hmm.wrongGuesses = [];
  hmm.mainResponse = null;
  hmm.numSyllables = 3;
  hmm.state = 'rhyme';
  hmm.numAnswerWords = 1;
  hmm.numUniqueLetters = 6;
  //ap = new AnswerListProvider();
}

//const hm_view = new HangmanView('input', 'output', 'banner', 'prompt', 'error');
export const ap = new AnswerListProvider();
export var hmm = new HangmanModel();
initGame();

//hm_view.banner.innerHTML = Msgs.getGameGreeting();
//hm_view.prompt.innerHTML = 'Enter rhyme:';
//hm_view.input.addEventListener('keydown', keydown_handler);
