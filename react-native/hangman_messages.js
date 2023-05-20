import Utils from './utils.js';

class Msgs {
  inputPhrase = 'Please guess a letter: ';
  dblLeterErrMsg = 'ONLY ONE letter allowed. Guess again: \n';
  lost = '\nSorry, YOU LOST!';
  won = '\nCONGRATULATIONS, YOU WON!';
  y_or_n_only = "Please enter only the letters 'Y' or 'N' only";

  static getBanner(numTotalLetters, numUniqueLetters) {
    let banner =
      'Your answer has: \n' +
      numTotalLetters +
      ' letters total (' +
      numUniqueLetters +
      ' Unique),\n';
    return banner;
  }

  static getFooter(numAnswerWords, numSyllables) {
    let plural = 's';
    if (numAnswerWords === 1) plural = '';
    let footer =
      numAnswerWords + ' Word' + plural + ' & ' + numSyllables + ' Syllables.';
    return footer;
  }

  static getGameGreeting() {
    let myText =
      //'=========================\n' +
      "==== Flak's Hangman! ====\n";
    //'=========================\n';
    return myText;
  }

  static getHangmanDrawing(
    pWord,
    msg,
    gWrongGuesses,
    gChoice,
    gGuessesRemaining,
    gNumSyllables
  ) {
    //let pWord = gFullGuess.join(' ');
    let wGuesses = gWrongGuesses.join(' ');
    let numUnique = Utils.getNumUniqueLetters(gChoice);
    let numTotal = gChoice.length;
    let banner = Msgs.getBanner(numTotal, numUnique);
    let numAnswerWords = gChoice.split(' ').length;
    let footer = Msgs.getFooter(numAnswerWords, gNumSyllables);

    let preMsg = banner + footer + '\n';
    msg = preMsg + msg;
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
}

export default Msgs;
