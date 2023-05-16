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
export default Utils;
