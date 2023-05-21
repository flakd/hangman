import axios, * as others from 'axios';
import Msgs from './hangman_messages.js';
import Utils from './utils.js';

class Result {
  bool; //bool;
  message; //str

  constructor() {
    this.bool = false;
    this.message = '';
  }
}

class AnswerResponse {
  _num_answer_words; //int;
  _answer_list; //list[str];
  _answer_words; //list[str];
  _numTotalLetters; //int;
  _numUniqueLetters; //int;
  num_syllables; //int;
  _answer_word_group; //str;
  search_term; //str;
  num_answers; //int;
  response_msg; //str;
  was_successful; //bool;
  max_syllables; //int;
  num_syllables_dict; //dict;

  __setOtherDefaults(word_group) {
    this._num_answer_words = this.get_num_answer_words(word_group);
    this._answer_words = this.get_answer_words(word_group);
    this._numTotalLetters = word_group.length;
    this._numUniqueLetters = Utils.getNumUniqueLetters(word_group);
  }

  set_word_group(word_group) {
    for (var letter of word_group) {
      if (!Utils.alpha_dict.hasOwnProperty(letter) && letter !== ' ') {
        throw new Error(
          'ERROR: somehow after all the REST calls and dbl-chking, this word group is not alpha + SPACE. ABORTING APPLICATION'
        );
      }
    }
    this._answer_word_group = word_group;
    this.__setOtherDefaults(word_group);
  }

  get_word_group() {
    return this._answer_word_group;
  }

  get_answer_words(word) {
    return word.split();
  }

  get_num_answer_words(word) {
    return this.get_answer_words(word).length;
  }
}

class AnswerListProvider {
  __get_answer_list() {
    let answerList = ['ardvark', 'baboon', 'cougar', 'dingo', 'door hinge'];
    return answerList;
  }

  get_answer_from_list() {
    let answer_list = this.__get_answer_list();
    return Utils.choose(answer_list);
  }

  isAxiosLoaded() {
    if (axios) {
      return true;
    } else {
      return false;
    }
  }
  getResponse(searchTerm) {
    //searchTerm = 'tree';
    let headers = {
      'User-Agent':
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
    };
    let url =
      'https://api.datamuse.com/' +
      'words?' +
      ('rel_rhy=' + searchTerm + '&') +
      ('max=' + 1000 + '&'); //+
    //('&v=' + 'enwiki' + '&');
    let numLoops = 0;
    while (!this.isAxiosLoaded()) {
      if (numLoops > 100) {
        hm_view.printIHC('There appears to be some sort of server problem');
      }
      numLoops++;
    }
    /*     hmm.answer_response = new AnswerResponse();
    hmm.answer_response.response_msg = 'server request OK';
 */
    console.log('axios loaded');
    let test;
    return axios.get(url).catch((error) => {
      //hmm.answer_response.response_msg = error;
      //console.error(hmm.answer_response.response_msg);
    });
    /*
        except requests.exceptions.HTTPError as errh:
            print("\n\nHttp Error:", errh, "\n\n")
        except requests.exceptions.ConnectionError as errc:
            // print ("\n\nError Connecting:",errc,"\n\n")
            message = "\n\nThere's been an error connecting to the server.  Please try again in a few seconds."
        except requests.exceptions.Timeout as errt:
            print("\n\nTimeout Error:", errt, "\n\n")
        except requests.exceptions.RequestException as err:
            print("\n\nOops: Something Else", err, "\n\n") 
        */
    //  console.error(error);
    //  message = error;
    //});
  }
}

class HangmanView {
  input; //HTMLInputElement;
  output; //HTMLDivElement
  banner;
  prompt;
  error;
  constructor(idOfInput, idOfOutput, idOfBanner, idOfPrompt, idOfError) {
    /*     this.input = document.getElementById(idOfInput);
    if (!this.input) console.error('NO ELEMENT WITH ID of %s', idOfInput);

    this.output = document.getElementById(idOfOutput);
    if (!this.output) console.error('NO ELEMENT WITH ID of %s', idOfOutput);
    this.output.readOnly = true;
    this.output.disabled = true;

    this.banner = document.getElementById(idOfBanner);
    if (!this.banner) console.error('NO ELEMENT WITH ID of %s', idOfBanner);

    this.prompt = document.getElementById(idOfPrompt);
    if (!this.prompt) console.error('NO ELEMENT WITH ID of %s', idOfPrompt);

    this.error = document.getElementById(idOfError);
    if (!this.error) console.error('NO ELEMENT WITH ID of %s', idOfError); */
  }
}
class HangmanModel {}

function keydown_handler(event) {
  //if (event.keyCode === 13) {
  let input;
  if (event.key === 'Enter') {
    input = event.target.value.toLowerCase();
    event.target.value = '';
    enterKeyHandler(input);
  }
}

function enterKeyHandler(input) {
  if (hmm.state === 'rhyme') {
    rhymeHandler(input);
  }
  //console.log(mainResponse.data);
  if (hmm.state === 'syllables') {
    syllablesHandler(input);
  }
  if (hmm.state === 'guess') {
    hm_view.input.style.display = 'none';
    mainGameLoop(input, hmm.mainResponse.data);
  }
  if (hmm.state === 'won') {
    wonHandler(input);
  }
  if (hmm.state === 'lost') {
    lostHandler(input);
  }
}

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
function syllablesHandler(input) {
  let numSyl = parseInt(input);
  hmm.numSyllables = numSyl;
  if (input.trim() === '') return;
  if (!Utils.isNumeric(input)) return;
  if (!Utils.is_string_an_int_between(input, 1, numSyl)) return;
  let sylArrays = getMainRespAsSylArraysObject();
  let sylChoiceArray = trimListByNumSyl(sylArrays, numSyl);
  hmm.choice = Utils.choose(sylChoiceArray);
  console.log(hmm.choice);
  for (var letter of hmm.choice) {
    if (letter === ' ') hmm.fullGuess.push(' ');
    else hmm.fullGuess.push('_');
  }
  //addOutputLn('answer: ' + hmm.choice);
  hmm.state = 'guess';
  setPrompt('Guess a letter: ');
}

async function rhymeHandler(input) {
  if (input.trim() === '') return;
  if (Utils.isNumeric(input)) return;
  if (!Utils.is_whole_word_alpha(input)) return;
  let response = await ap.getResponse(input);
  console.log(response);
  hmm.mainResponse = response;
  hmm.state = 'syllables';
  setPrompt('syllables: ');
}

function getMainRespAsSylArraysObject() {
  let allSylsArray = getAllSylsArray();
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
  function getAllSylsArray() {
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

function setError(text) {
  hm_view.error.innerHTML = text;
}
function setPrompt(text) {
  hm_view.prompt.innerHTML = text;
}
function setOutput(text) {
  hm_view.output.innerHTML = text + '\n';
}
function addOutput(text) {
  hm_view.output.innerHTML += text + '\n';
}
function addOutputLn(text) {
  hm_view.output.innerHTML += text + '\n';
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
  hmm.fullGuess = [];
  hmm.choice = '';
  hmm.guessesRemaining = 6;
  hmm.wrongGuesses = [];
  hmm.mainResponse = null;
  hmm.numSyllables = 0;
  hmm.state = 'rhyme';
}
export const ap = new AnswerListProvider();
export const hmm = new HangmanModel();
const hm_view = new HangmanView('input', 'output', 'banner', 'prompt', 'error');

//hm_view.banner.innerHTML = Msgs.getGameGreeting();
//hm_view.prompt.innerHTML = 'Enter rhyme:';
//hm_view.input.addEventListener('keydown', keydown_handler);
initGame();

//exports.ap = ap;
//exports.hmm = hmm;
//exports.hm_view = hm_view;
