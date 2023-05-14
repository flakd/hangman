class Msgs {
  inputPhrase = 'Please guess a letter: ';
  dblLeterErrMsg = 'ONLY ONE letter allowed. Guess again: \n';
  lost = '\nSorry, YOU LOST!';
  won = '\nCONGRATULATIONS, YOU WON!';
  y_or_n_only = "Please enter only the letters 'Y' or 'N' only";

  static getBanner(hm) {
    let banner =
      'Your answer has: \n' +
      hm.answer_response._numTotalLetters +
      ' letters total (' +
      hm.answer_response._numUniqueLetters +
      ' Unique),';
    return banner;
  }

  static getFooter(hm) {
    let plural = 's';
    if (hm.answer_response._num_answer_words === 1) {
      plural = '';
    }
    let footer =
      hm.answer_response._num_answer_words +
      ' Word' +
      plural +
      ' & ' +
      hm.answer_response.num_syllables +
      ' Syllables.';
    return footer;
  }
}

export default Msgs;
