import axios, * as others from 'axios';

class Utils {
  static alpha_dict = Utils.setupDict();
  static setupDict() {
    let dict = {};
    for (let i = 97; i <= 122; i++) {
      //lowercase ASCII codes
      let letter = String.fromCharCode(i);
      dict[letter] = 0;
    }
    console.log(dict); // outputs: {a: 0, b: 0... z: 0}
    return dict;
  }

  static sp(numSpaces) {
    let spaces = '';
    for (var i = 0; i < numSpaces; i++) {
      spaces += ' ';
    }
    return spaces;
  }
  static nbsp(numSpaces) {
    let spaces = '';
    for (var i = 0; i < numSpaces; i++) {
      spaces += '&nbsp;';
    }
    return spaces;
  }
  static char(numChars) {
    let chars = '';
    for (var i = 0; i < numChars; i++) {
      chars += ' ';
    }
    return chars;
  }
  static compareScores(a, b) {
    return a.score - b.score;
  }
  static choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
  static printInnerTextAsPre_Clear(el, pre_text) {
    if (!el) {
      console.error('printInnerTextAsPre: missing element');
      return;
    }
    el.innerText = '';
    el.innerText += pre_text + '\n';
  }
  static printInnerTextAsPre(el, pre_text) {
    if (!el) {
      console.error('printInnerTextAsPre: missing element');
      return;
    }
    //el.innerText = '<pre>' + '\n';
    el.innerText += pre_text + '\n';
    //el.innerText += '</pre>' + '\n';
  }
  static printInnerHTMLAsPre_Clear(el, pre_text) {
    if (!el) {
      console.error('printInnerHTMLAsPre_Clear: missing element');
      return;
    }
    el.innerHTML = '';
    el.innerHTML += pre_text + '\n';
  }
  static printInnerHTMLAsPre(el, pre_text) {
    if (!el) {
      console.error('printInnerHTMLAsPre: missing element');
      return;
    }
    //el.innerHTML += '<code>';
    el.innerHTML += pre_text + '\n';
    //el.innerHTML += '</code>' + '\n';
  }
  static hasNumber(myString) {
    return /\d/.test(myString);
  }
  static isNumeric(str) {
    if (typeof str != 'string') return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }
  static is_whole_word_alpha(word) {
    let is_alpha = true;
    for (var letter of word) {
      if (!Object.keys(Utils.alpha_dict).includes(letter)) is_alpha = false;
    }
    return (
      is_alpha &&
      word !== ' ' &&
      !Utils.hasNumber(word) &&
      word !== null &&
      word !== '' &&
      word.trim() !== ''
    );
  }
  static is_string_an_int_between(word, firstNumStr, secondNumStr) {
    //if (!secondNumStr) secondNumStr = hmm.answer_response.max_syllables;
    let is_between = false;
    if (Utils.isNumeric(word)) {
      if (parseInt(word) >= firstNumStr && parseInt(word) <= secondNumStr) {
        is_between = true;
      }
    }
    return is_between;
  }
  static getNumUniqueLetters(word) {
    for (var letter of word) {
      try {
        Utils.alpha_dict[letter] += 1;
      } catch (error) {
        console.error("The key ['" + letter + "'] is missing in alphaDict");
      }
    }
    let numUniqueLetters = 0;
    for (var el in Utils.alpha_dict) {
      if (Utils.alpha_dict[el] > 0) {
        numUniqueLetters += 1;
      }
    }
    return numUniqueLetters;
  }
}

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
      'https://api.datamuse.com/words?rel_rhy=' + searchTerm + '&max=1000';

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
  state = '';
  input; //HTMLInputElement;
  output; //HTMLDivElement
  banner;
  prompt;
  error;
  constructor(idOfInput, idOfOutput, idOfBanner, idOfPrompt, idOfError) {
    this.input = document.getElementById(idOfInput);
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
    if (!this.error) console.error('NO ELEMENT WITH ID of %s', idOfError);
  }
}

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
  if (state === 'rhyme') {
    rhymeHandler(input);
  }
  //console.log(mainResponse.data);
  if (state === 'syllables') {
    syllablesHandler(input);
  }
  if (state === 'guess') {
    mainGameLoop(input, gMainResponse.data);
  }
  if (state === 'won') {
    wonHandler(input);
  }
  if (state === 'lost') {
    lostHandler(input);
  }
}

function wonHandler(input) {
  setOutput('You Won!  Should we play again?');
  shouldPlayAgain(input);
}
function lostHandler(input) {
  setOutput('You Lost!  Should we play again?');
}
function shouldPlayAgain(input) {
  if (input === 'y') {
    setPrompt('Enter a rhyming word: ');
    setOutput('');
  } else if (input === 'n')
    setOutput(
      "Sorry you won't be playing again.\n Have a great day!  Bye now.\n"
    );
}
function syllablesHandler(input) {
  let numSyl = parseInt(input);
  let sylArrays = getMainRespAsSylArraysObject();
  let sylChoiceArray = trimListByNumSyl(sylArrays, numSyl);
  gChoice = Utils.choose(sylChoiceArray);
  console.log(gChoice);
  for (var letter of gChoice) {
    if (letter === ' ') gFullGuess.push(' ');
    else gFullGuess.push('_');
  }
  addOutputLn('answer: ' + gChoice);
  state = 'guess';
  setPrompt('Guess a letter: ');
}

async function rhymeHandler(input) {
  let response = await ap.getResponse(input);
  console.log(response);
  gMainResponse = response;
  state = 'syllables';
  setPrompt('syllables: ');
}

function getMainRespAsSylArraysObject() {
  let allSylsArray = getAllSylsArray();
  let sylChoicesArrays = getEmptySylChoicesArrayAsObject(allSylsArray);
  return getSylChoicesArraysAsObject(sylChoicesArrays);
  function getSylChoicesArraysAsObject(sylChoicesArraysAsObjects) {
    for (var wordGroup of gMainResponse.data) {
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
    for (var wordGroup of gMainResponse.data) {
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
function getHangmanDrawing(pWord, msg) {
  //let pWord = this.getFormattedAnswerGuess();
  let wGuesses = gWrongGuesses.join(' ');
  //let banner = Msgs.getBanner(hmm);
  //let footer = Msgs.getFooter(hmm);

  //this.printIT(banner + footer);
  //this.printIT('\n');

  let bodyPartsHead = '   ';
  let bodyPartsTorso = '   ';
  let bodyPartsLegs = '   ';

  if (gGuessesRemaining < 6) bodyPartsHead = ' O ';
  if (gGuessesRemaining === 4) bodyPartsTorso = ' | ';
  if (gGuessesRemaining === 3) bodyPartsTorso = '/| ';
  if (gGuessesRemaining <= 2) bodyPartsTorso = '/|\\';
  if (gGuessesRemaining === 1) bodyPartsLegs = '/  ';
  if (gGuessesRemaining === 0) bodyPartsLegs = '/ \\';

  let output = '';
  output += `${msg}`;
  output += '\n';
  output += `  +-----+     Wrong Guesses\n`;
  output += `  |/    !     -------------\n`;
  output += `  |    ${bodyPartsHead}    ${wGuesses}\n`;
  output += `  |    ${bodyPartsTorso}  \n`;
  output += `  |    ${bodyPartsLegs}   \n`;
  output += `  |                      \n`;
  output += ` /|\\        ${pWord}        \n`;
  output += `/_|_\\                    \n`;
  return output;
}

function mainGameLoop(guess, response) {
  let result;
  if (Utils.isNumeric(guess)) {
    //setError('That is a number.  Please enter one Alpha/Letter');
    return;
  }

  if (!Utils.is_whole_word_alpha(guess)) {
    //setError('Only one Alpha/Letter is allowed');
    return;
  }
  if (!(gFullGuess.join('') === gChoice || gGuessesRemaining === 0)) {
    let isCorrectGuess = false;
    for (var idx in gChoice) {
      if (guess === gChoice[idx]) {
        gFullGuess[idx] = guess;
        isCorrectGuess = true;
      }
    }
    if (!isCorrectGuess) {
      addOutputLn("'" + guess + "' is wrong");
      gWrongGuesses.push(guess);
      gGuessesRemaining -= 1;
    }
    let output = getHangmanDrawing(gFullGuess.join(' '));
    //addOutputLn('guess: ' + guess);
    //addOutputLn('Full Guess: ' + gFullGuess.join(' '));
    setOutput(output);
    state = 'guess';
    setPrompt('Guess a letter: ');
  } else {
    if (gFullGuess.join('') === gChoice) {
      state = 'won';
      return;
    }
    if (gGuessesRemaining === 0) {
      state = 'lost';
      return;
    }
  }
}

const debug = true;
const ap = new AnswerListProvider();
//const hmm = new HangmanModel();
const hm_view = new HangmanView('input', 'output', 'banner', 'prompt', 'error');
//hm_view.start(hmm, debug);
let state = 'rhyme';
hm_view.prompt.innerHTML = 'Enter a rhyming word: ';
let gMainResponse;
let gFullGuess = [];
let gChoice = '';
let gGuessesRemaining = 6;
let gWrongGuesses = [];
hm_view.input.addEventListener('keydown', keydown_handler);
