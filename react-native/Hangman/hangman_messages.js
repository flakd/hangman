import Utils from './utils.js';

class Msgs {
  inputPhrase = 'Please guess a letter: ';
  dblLeterErrMsg = 'ONLY ONE letter allowed. Guess again: \n';
  lost = '\nSorry, YOU LOST!';
  won = '\nCONGRATULATIONS, YOU WON!';
  y_or_n_only = "Please enter only the letters 'Y' or 'N' only";

  static getHeading(
    numTotalLetters,
    numUniqueLetters,
    numAnswerWords,
    numSyllables
  ) {
    let heading =
      'ANSWER: ' +
      numTotalLetters +
      ' letters total (' +
      numUniqueLetters +
      ' Unique),\n';
    let plural = 's';
    if (numAnswerWords === 1) plural = '';
    heading +=
      numAnswerWords + ' Word' + plural + ' & ' + numSyllables + ' Syllables.';
    return heading;
  }

  static getGameGreeting() {
    let myText =
      //'=========================\n' +
      "=== Flak's Hangman! ===\n";
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
    //let banner = Msgs.getHeading(numTotal, numUnique);
    let numAnswerWords = gChoice.split(' ').length;
    //let footer = Msgs.getFooter(numAnswerWords, gNumSyllables);

    //let preMsg = banner + footer + '\n';
    let preMsg = '';
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
