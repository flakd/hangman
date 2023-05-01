import os

class HangmanUI:
  
  @staticmethod
  def draw(gi, pWord, wGuesses, banner, msg, footer):
      # Clearing the Screen
    os.system('clear')    
    print(banner, footer)
    print()

    bodyPartsHead = "   "
    bodyPartsTorso = "   "
    bodyPartsLegs = "   "

    if gi.guessesLeft < 6:
      bodyPartsHead = " O "
    if gi.guessesLeft == 4:
      bodyPartsTorso = " | "
    if gi.guessesLeft == 3:  
      bodyPartsTorso = "/| "
    if gi.guessesLeft <= 2:
      bodyPartsTorso = "/|\\"
    if gi.guessesLeft == 1:
      bodyPartsLegs = "/  "
    if gi.guessesLeft == 0:
      bodyPartsLegs = "/ \\"

    print(f"{msg}")
    print()
    print(f"  +-----+     Wrong Guesses")
    print(f"  |/    !     -------------")
    print(f"  |    {bodyPartsHead}    {wGuesses}") 
    print(f"  |    {bodyPartsTorso}  ")
    print(f"  |    {bodyPartsLegs}   ")
    print(f"  |                      ")  
    print(f" /|\      {pWord}        ")        
    print(f"/_|_\                    ")     


  @staticmethod
  def showGameGreeting():
    # Clearing the Screen
    os.system('clear')    
    myText = """

    ==============================================
    =====     Welcome to Flak's Hangman!     =====
    ==============================================
    
    """
    print(myText)


  @staticmethod
  def partialWordAsUI(hangman):
    return " ".join(hangman.partialWordAsStr())