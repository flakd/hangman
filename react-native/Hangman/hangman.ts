import Msgs from './hangman_messages.js';
import {AnswerListProvider} from './hangman_answer.js';
import Utils from './utils.js';

export class HangmanModel {
  fullGuess;
  choice;
  fullGuess;
  guessesRemaining;
  wrongGuesses;
  mainResponse;
  numSyllables;
  state;
  numAnswerWords;
  numUniqueLetters;
}

export const validaters = {
  isSyllablesValid: function (input, hmm) {
    if (input.trim() === '') return false;
    if (!Utils.isNumeric(input)) return false;
    // TODO:  do I even need the next (2) line(s)
    //if (!Utils.is_string_an_int_between(input, 1, numSyl)) return false;
    if (!Utils.is_string_an_int_between(input, 1, 9)) return false;
    return true;
  },
  isRhymeValid: function (input) {
    if (input.trim() === '') return false;
    if (Utils.isNumeric(input)) return false;
    if (!Utils.is_whole_word_alpha(input)) return false;
    return true;
  },
};

export class sylFunctions {
  static parseSyllables(input) {
    let numSyl = parseInt(input);
    hmm.numSyllables = numSyl;
    let sylArrays = sylFunctions.getMainRespAsSylArraysObject(hmm, numSyl);
    let sylChoiceArray = sylFunctions.trimListByNumSyl(sylArrays, numSyl);
    hmm.choice = Utils.choose(sylChoiceArray);
    console.log('hmm.choice: ', hmm.choice);
    hmm.fullGuess = [];
    for (var letter of hmm.choice) {
      if (letter === ' ') hmm.fullGuess.push(' ');
      else hmm.fullGuess.push('_');
    }
    hmm.state = 'guess';
    return;
  }
  static getMainRespAsSylArraysObject(hmm, numSyl) {
    let allSylsArray = sylFunctions.getAllSylsArray(hmm);
    let sylChoicesArrays =
      sylFunctions.getEmptySylChoicesArrayAsObject(allSylsArray);
    return sylFunctions.getSylChoicesArraysAsObject(sylChoicesArrays);
  }
  static getSylChoicesArraysAsObject(sylChoicesArraysAsObjects) {
    for (var wordGroup of hmm.mainResponse.data) {
      sylChoicesArraysAsObjects[wordGroup.numSyllables].push(wordGroup.word);
    }
    return sylChoicesArraysAsObjects;
  }
  static getEmptySylChoicesArrayAsObject(allSylsArray) {
    let sylChoicesArrays = {};
    let max = Math.max(...allSylsArray);
    for (var i = 1; i < max + 1; i++) {
      sylChoicesArrays[i] = [];
    }
    return sylChoicesArrays;
  }
  static getAllSylsArray(hmm) {
    let allSylsArray = [];
    for (var wordGroup of hmm.mainResponse.data) {
      allSylsArray.push(wordGroup.numSyllables);
    }
    return allSylsArray;
  }
  static trimListByNumSyl(sylArrays, numSyl) {
    console.log(sylArrays[numSyl]);
    return sylArrays[numSyl];
  }
}

export function mainGameLoop(guess: string): {
  msg: string,
  output: string,
  gameState: string,
} {
  let result;
  if (guess.trim() === '') return false;
  if (Utils.isNumeric(guess)) return false;
  if (!Utils.is_whole_word_alpha(guess)) return false;
  if (guess.length > 1) return false;
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
  let output = Msgs.getOutput(hmm);
  hmm.state = 'guess';
  if (hmm.fullGuess.join('') === hmm.choice) {
    hmm.state = 'won';
    output += '\n\nYou Won!!!!';
  }
  if (hmm.guessesRemaining === 0) {
    hmm.state = 'lost';
    output += '\n\nYou Lost!!!!';
  }
  return {msg: msg, output: output, gameState: hmm.state};
  //}
}

export function initGame() {
  hmm.fullGuess = [];
  hmm.choice = 'ass';
  for (var letter of hmm.choice) {
    hmm.fullGuess.push('_');
  }
  hmm.guessesRemaining = 7;
  hmm.wrongGuesses = [];
  hmm.mainResponse = null;
  hmm.numSyllables = null;
  hmm.state = 'rhyme';
  hmm.numAnswerWords = null;
  hmm.numUniqueLetters = null;
}

export const ap = new AnswerListProvider();
export var hmm = new HangmanModel();
initGame();
