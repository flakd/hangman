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
  static char(char, numChars) {
    let chars = '';
    for (var i = 0; i < numChars; i++) {
      chars += char;
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

  static getNumAnswerWords(word) {
    return word.split(' ').length;
  }

  static toTitleCase(str) {
    // Step 1. Lowercase the string
    str = str.toLowerCase();
    // str = "I'm a little tea pot".toLowerCase();
    // str = "i'm a little tea pot";

    // Step 2. Split the string into an array of strings
    str = str.split(' ');
    // str = "i'm a little tea pot".split(' ');
    // str = ["i'm", "a", "little", "tea", "pot"];

    // Step 3. Create the FOR loop
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      /* Here str.length = 5
      1st iteration: str[0] = str[0].charAt(0).toUpperCase() + str[0].slice(1);
                    str[0] = "i'm".charAt(0).toUpperCase()  + "i'm".slice(1);
                    str[0] = "I"                            + "'m";
                    str[0] = "I'm";
      2nd iteration: str[1] = str[1].charAt(0).toUpperCase() + str[1].slice(1);
                    str[1] = "a".charAt(0).toUpperCase()    + "a".slice(1);
                    str[1] = "A"                            + "";
                    str[1] = "A";
      3rd iteration: str[2] = str[2].charAt(0).toUpperCase()   + str[2].slice(1);
                    str[2] = "little".charAt(0).toUpperCase() + "little".slice(1);
                    str[2] = "L"                              + "ittle";
                    str[2] = "Little";
      4th iteration: str[3] = str[3].charAt(0).toUpperCase() + str[3].slice(1);
                    str[3] = "tea".charAt(0).toUpperCase()  + "tea".slice(1);
                    str[3] = "T"                            + "ea";
                    str[3] = "Tea";
      5th iteration: str[4] = str[4].charAt(0).toUpperCase() + str[4].slice(1);
                    str[4] = "pot".charAt(0).toUpperCase() + "pot".slice(1);
                    str[4] = "P"                           + "ot";
                    str[4] = "Pot";                                                         
      End of the FOR Loop*/
    }

    // Step 4. Return the output
    return str.join(' '); // ["I'm", "A", "Little", "Tea", "Pot"].join(' ') => "I'm A Little Tea Pot"
  }
}
export default Utils;
