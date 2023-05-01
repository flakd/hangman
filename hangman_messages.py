

class Msgs:
  inputPhrase = "Please guess a letter: "
  dblLeterErrMsg = "ONLY ONE letter allowed. Guess again: "
  lost = "\nSorry, YOU LOST!"
  won = "\nCONGRATULATIONS, YOU WON!"

  @staticmethod
  def getBanner(hm):
    banner =  "Your answer has: \n" + \
              str(len(hm.answer.value)) + \
              " TOTAL letters. " + \
              str(hm.answer.numUniqueLetters) + \
              " UNIQUE."
    return banner

  @staticmethod
  def getFooter(hm):
    plural = "s"
    if hm.answer.numWords == 1:
      plural = ""
    footer = str(hm.answer.numWords) + " Word" + plural +"."
    return footer