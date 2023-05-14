//const axios = require('axios');
//import * as axios from 'axios';
import axios, * as others from 'axios';
import Msgs from './hangman_messages.js';
let temp = 0;

function wtf() {
  document.write('testing');
}
//alert('hi');
wtf();
wtf();

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
    if (!secondNumStr) secondNumStr = hmm.answer_response.max_syllables;
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
  get_answer_response(searchTerm) {
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
    hmm.answer_response = new AnswerResponse();
    hmm.answer_response.response_msg = 'server request OK';
    console.log('axios loaded');
    let test;
    return axios.get(url).catch((error) => {
      hmm.answer_response.response_msg = error;
      console.error(hmm.answer_response.response_msg);
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

    this.state = 'rhyme';
  }
  getFormattedAnswerGuess() {
    let result = [];
    let formattedResult = '';
    let ag = hmm.answer_response._answer_guess;
    for (var letter of ag) {
      if (letter === '') result.push('_');
      else result.push(letter);
    }
    formattedResult = result.join(' ');
    return formattedResult;
  }
  getHangmanDrawing(msg) {
    let pWord = this.getFormattedAnswerGuess();
    let wGuesses = hmm._wrong_guesses.join(' ');
    let banner = Msgs.getBanner(hmm);
    let footer = Msgs.getFooter(hmm);

    this.printIT(banner + footer);
    this.printIT('\n');

    let bodyPartsHead = '   ';
    let bodyPartsTorso = '   ';
    let bodyPartsLegs = '   ';

    if (hmm._guesses_remaining < 6) bodyPartsHead = ' O ';
    if (hmm._guesses_remaining === 4) bodyPartsTorso = ' | ';
    if (hmm._guesses_remaining === 3) bodyPartsTorso = '/| ';
    if (hmm._guesses_remaining <= 2) bodyPartsTorso = '/|\\';
    if (hmm._guesses_remaining === 1) bodyPartsLegs = '/  ';
    if (hmm._guesses_remaining === 0) bodyPartsLegs = '/ \\';

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

  printIT(text, that) {
    if (this) {
      Utils.printInnerTextAsPre(this.output, text);
      //this.output.value = this.output.value + text;
    } else {
      Utils.printInnerTextAsPre(that.output, text);
      //that.output.value = this.output.value + text;
    }
  }
  printITC(text, that) {
    if (this) {
      Utils.printInnerTextAsPre_Clear(this.output, text);
      //this.output.value = text;
    } else {
      Utils.printInnerTextAsPre_Clear(that.output, text);
      //this.output.value = text;
    }
  }
  printIH(text, that) {
    if (this) {
      Utils.printInnerHTMLAsPre(this.output, text);
    } else {
      Utils.printInnerHTMLAsPre(that.output, text);
    }
  }
  printIHC(text, that) {
    if (this) {
      Utils.printInnerHTMLAsPre_Clear(this.output, text);
    } else {
      Utils.printInnerHTMLAsPre_Clear(that.output, text);
    }
  }
  setPrompt(text) {
    Utils.printInnerHTMLAsPre_Clear(this.prompt, text);
  }
  setBanner(text) {
    Utils.printInnerHTMLAsPre_Clear(this.banner, text);
  }
  setError(text) {
    Utils.printInnerHTMLAsPre_Clear(this.error, text);
  }
  showGameGreeting() {
    //Clearing the Screen;
    //os.system('clear');
    let myText =
      '========================================\n' +
      '====' +
      Utils.nbsp(3) +
      "Welcome to Flak's Hangman!" +
      Utils.nbsp(3) +
      '====\n' +
      '========================================\n';
    this.setBanner(myText);
  }

  start(hmm, debug) {
    this.showGameGreeting();
    this.setPrompt('Enter Rhyme: ');

    let that = this;
    this.input.addEventListener('keydown', async function (event) {
      let val = event.target.value;
      let answerResponse;
      if (event.key === 'Enter') {
        //that.main_game_loop(val, that, hmm, debug);
        let answerResponse = new AnswerResponse();
        if (that.state === 'rhyme') {
          //let ok = await that.getAnswerListFromRhyme(val, answerResponse, that).was_successful;

          //getAnswerListFromRhyme(val, answerResponse, that) {
          if (Utils.is_whole_word_alpha(val)) {
            let answerList = [];
            let temp_list = [];
            try {
              let response = await ap.get_answer_response(val);
              console.log(response.data);
              for (var answer of response.data) {
                if (answer.score) {
                  if (answer.score > 100) {
                    temp_list.push(answer);
                  }
                }
              }
              console.log(temp_list);
              let answer_list = [];
              for (var wordGroup of temp_list) {
                answer_list.push(wordGroup);
              }
              hmm.answer_response = answerResponse;
              hmm.answer_response._answer_list = answer_list;
              answerList = hmm.answer_response._answer_list;
              console.log(answerList);
              //that.printIH(JSON.stringify(al, null, 2));
              if (!hmm.was_search_successful(val)) {
                that.start(hmm, debug);
              }
              hmm.searchTerm = val;
            } catch (error) {
              console.error(error);
              hmm.answer_response.response_msg = error;
            }
            if (!answerList && answerList.length === 0) {
              hmm.answer_response.was_successful = false;
              hmm.answer_response.response_msg =
                "can't find anything that rhymes with '" + val + "'!";
            }
            that.state = 'syllables';
            hmm.answer_response.was_successful = true;
          } else {
            hmm.answer_response.response_msg =
              'You entered non-alpha characters.  Please enter a real word';
          }
          //return hmm.answer_response;
          //}

          let ok = hmm.answer_response.was_successful;
          if (ok) {
            that.setPrompt('num syllables: ');
            that.state = 'syllables';
          } else {
            that.setError(hmm.answer_response.response_msg);
          }
        }
        if (that.state === 'syllables') {
          if (that.getWordGroupFromSyllables(val, that)) {
            that.setPrompt('Please enter a one-letter guess: ');
            that.state = 'guessing';
            that.initNewGame();
          }
        }
        if (that.state === 'guessing') {
          let guess = val;
          let result = hmm.is_guess_in_answer(guess);
          hmm.update_game_state(result.bool, guess);
          //that.printITC(result.message);
          that.printITC(that.getHangmanDrawing(result.message));

          let gr = hmm._guesses_remaining;
          let ag = hmm.answer_response._answer_guess;
          let wg = hmm.answer_response.get_word_group();
          if (gr === 0 || ag === wg) {
            that.printITC('At bottom of game loop, leaving game now');
          }
        }
        event.target.value = '';
      }
    });
  }
  initNewGame() {
    hmm._answer_guess = hmm.get_init_answer_guess();
    hmm._guesses_remaining = 6;
    hmm._wrong_guesses = [];
  }
  getAnswerListFromRhyme(val, answerResponse, that) {
    if (Utils.is_whole_word_alpha(val)) {
      let answerList = [];
      let temp_list = [];
      try {
        let response = ap.get_answer_response(val);
        console.log(response.data);
        for (var answer of response.data) {
          if (answer.score) {
            if (answer.score > 100) {
              temp_list.push(answer);
            }
          }
        }
        console.log(temp_list);
        let answer_list = [];
        for (var wordGroup of temp_list) {
          answer_list.push(wordGroup);
        }
        hmm.answer_response = answerResponse;
        hmm.answer_response._answer_list = answer_list;
        answerList = hmm.answer_response._answer_list;
        console.log(answerList);
        //that.printIH(JSON.stringify(al, null, 2));
        if (!hmm.was_search_successful(val)) {
          that.start(hmm, debug);
        }
        hmm.searchTerm = val;
      } catch (error) {
        console.error(error);
        hmm.answer_response.response_msg = error;
      }
      if (!answerList && answerList.length === 0) {
        hmm.answer_response.was_successful = false;
        hmm.answer_response.response_msg =
          "can't find anything that rhymes with '" + val + "'!";
      }
      this.state = 'syllables';
      hmm.answer_response.was_successful = true;
    } else {
      hmm.answer_response.response_msg =
        'You entered non-alpha characters.  Please enter a real word';
    }
    return hmm.answer_response;
  }
  getWordGroupFromSyllables(val, that) {
    let num_syllables_choice;
    if (Utils.is_string_an_int_between(val, 1)) {
      // search successful, let's narrow down the results
      num_syllables_choice = val;
      hmm.choose_answer_from_answer_list(hmm.searchTerm, num_syllables_choice);
      let wg = hmm.answer_response.get_word_group();
      that.printIT('\n' + hmm.answer_response.response_msg);
      // debugging
      if (debug) hmm.answer_response.set_word_group('test');
      that.printIT(wg);
      /////////
      return Utils.is_whole_word_alpha(wg);
    }
  }
  async main_game_loop(val, that, hmm) {}
}

class HangmanModel {
  answer_response; //AnswerResponse
  _current_guess_letter; //str
  _answer_provider; //AnswerListProvider
  _guesses_remaining; //int
  _answer_guess; //list[str]
  _wrong_guesses; //list[str]

  get_init_answer_guess() {
    this.answer_response._answer_guess = [];
    for (var letter of hmm.answer_response.get_word_group()) {
      this.answer_response._answer_guess.push('');
    }
    return this.answer_response._answer_guess;
  }
  is_guess_in_answer(guess) {
    let result = new Result();
    result.bool = false;
    this._current_guess_letter = guess;
    result.bool = this.answer_response._answer_word_group.includes(guess);
    if (result.bool) {
      let wg = hmm.answer_response._answer_word_group;
      for (var idx in wg) {
        if (wg[idx] === guess) {
          this._answer_guess[idx] = guess;
          //result.message = "Updated Guess-Answer: " + hm_view.format_answer_guess_for_view(self._answer_guess)
        }
      }
      result.message =
        "The letter '" +
        guess +
        "', is correct! Good Guess! \nWhat will you guess next?\n";
    } else {
      result.message = 'Sorry, that guess is wrong!\n';
    }
    return result;
  }
  //6
  update_game_state(is_correct, guess) {
    let message = '';
    if (is_correct) {
      let wg = this.answer_response.get_word_group();
      for (var idx in wg) {
        if (wg[idx] == guess) {
          this._answer_guess[idx] = guess;
        }
      }
    } else {
      this._guesses_remaining -= 1;
      this._wrong_guesses.push(guess);
      message = this._guesses_remaining + ' guesses remaining!';
    }
    return message;
  }
  was_search_successful(searchTerm) {
    let alist = this.answer_response._answer_list;
    let num_answers = alist.length;
    this.answer_response.num_answers = num_answers;
    if (num_answers === 0) {
      this.answer_response.was_successful = false;
      let message =
        "Sorry I couldn't find any words that matched what you entered (" +
        searchTerm +
        ')';
      return false;
    } else {
      this.answer_response.was_successful = true;
      // max_syllables = max(answer_list, key=lambda mx: mx['numSyllables'])

      //  we want to get the range of syllables in these answer words.
      //  so we need the max number of syllables from whichever word
      //  has the most syllables. but we don't know which word that is.
      //
      //  so we will start by building an array of all the num syllables
      //  of all the words, then take the max() of that array.  Then 1 to
      //  this number is our range of all possible number of syllables
      let all_num_syllables = [];
      for (var answer of alist) {
        all_num_syllables.push(answer['numSyllables']);
      }
      console.log(all_num_syllables);
      this.answer_response.max_syllables = Math.max(...all_num_syllables);

      //  now we want to sort/filter each word by the num syllables.  so
      //  we create a dict of string arrays of all possible num syllables
      //  (e.g. "1", "2", "3", "4", etc.).
      let numSylDict = {};

      let max = this.answer_response.max_syllables;
      for (var num_syllables = 0; num_syllables < max; num_syllables++) {
        console.log(num_syllables);
        numSylDict[num_syllables + 1] = [];
      }

      //  Now, we iterate over all possible ANSWER RESPONSES and place ONLY
      //  the WORDthem in the appropriate dict slot/appending them to the
      //  array in that slot
      for (var answer of alist) {
        numSylDict[answer['numSyllables']].push(answer['word']);
      }
      this.answer_response.num_syllables_dict = numSylDict;
      return true;
    }
  }
  choose_answer_from_answer_list(searchTerm, num_syllables_choice) {
    this.answer_response.num_syllables = num_syllables_choice;
    let answers_to_choose_from =
      this.answer_response.num_syllables_dict[num_syllables_choice];
    let word_group = Utils.choose(answers_to_choose_from);
    hmm.answer_response.set_word_group(word_group);
    let message =
      'There are ' +
      answers_to_choose_from.length +
      ' answer(s) to guess with\n ' +
      num_syllables_choice +
      " syllables that rhyme with '" +
      searchTerm +
      "'.\n I'll randomly select one for you";
    hmm.answer_response.response_msg = message;
    hmm._answer_guess = hmm.get_init_answer_guess();
  }
}

const debug = true;
const ap = new AnswerListProvider();
const hmm = new HangmanModel();
const hm_view = new HangmanView('input', 'output', 'banner', 'prompt', 'error');
hm_view.start(hmm, debug);
