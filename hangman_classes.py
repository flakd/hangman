import string
from hangman_data import getAnswerFromProvider
from hangman_messages import Msgs
from hangman_ui import HangmanUI 



class Answer:
  alphaDict = dict.fromkeys(string.ascii_lowercase, 0)

  def __init__(self, word):  
    self.value = word
    self.numWords = self.getNumWords(word)
    self.Words = self.getWords(word)
    self.numTotalLetters = len(word)
    self.numUniqueLetters = self.getNumUniqueLetters(word) 
    #self.alphaDict 


  def getNumUniqueLetters(self,word):
    for letter in word:
      try:
        self.alphaDict[letter] += 1
      except:
        print(f"The key ['{letter}'] is missing in alphaDict")
    numUniqueLetters = 0
    for el in self.alphaDict:
      if self.alphaDict[el] > 0:
        numUniqueLetters += 1
    return numUniqueLetters

  def getWords(self,word):
    return word.split()
    
  def getNumWords(self, word):
    return len(self.getWords(word))



class Hangman:

  def __init__(self, searchTerm):
    self.guessesLeft = 6
    word = getAnswerFromProvider(searchTerm)
    self.answer = Answer(word)
    self.partialWord = []
    self.wrongGuesses = []


  def initPartialWord(self):
    for letter in self.answer.value:
      if letter == " ":
        self.partialWord.append(" ")    
      else:
        self.partialWord.append(None)    


  def getInput(self, inputPhrase, dblLeterErrMsg):
    print()
    print()
    guess = input(inputPhrase).lower()
    print()
    while len(guess) > 1:
      print (dblLeterErrMsg)
      guess = input(inputPhrase)
    return guess


  def partialWordAsStr(self):
    partialCharArray = []
    for idx in range(len(self.partialWord)):
      if self.partialWord[idx] is None:
        partialCharArray.append("_")
        #elif self.partialWord[idx] == " ":
        #partialCharArray.append(" ")      
      elif self.partialWord[idx] not in Answer.alphaDict.keys():
        partialCharArray.append("*")
      elif not isinstance(self.partialWord[idx], str):
        partialCharArray.append("*")
      else:
        partialCharArray.append(self.partialWord[idx])
    return "".join(partialCharArray)


  def isGuessInAnswer(self,guess):
    isCorrectGuess = False

    if guess not in Answer.alphaDict.keys():
        message = "the char '" + guess +"', is not an alphabetic letter. Please try again!\n"
    elif guess in self.partialWord:
      message = "The letter '" + guess + "', is correct! But, you've guessed it before! Try again!\n"
    else:
      for idx in range(len(self.answer.value)):
        if self.answer.value[idx] == guess:
          isCorrectGuess = True
          self.partialWord[idx] = guess
    
      if isCorrectGuess:
        message = "The letter '" + guess + "', is correct!"
        message += " Good Guess! What will you guess next?\n"

      if not isCorrectGuess:    
        if guess not in self.wrongGuesses:
          self.guessesLeft -= 1      
          self.wrongGuesses.append(guess)      
          message = "Sorry, the letter '" + guess + "' is a wrong guess! Try again!\n"
        else:
          message = "Wrong! But, you've guessed it before! So, I won't penalize you again.\n"

    message += "\nYou have " + str(self.guessesLeft) + " guesses left!\n"
    return message


  def shouldPlayAgain(self):
    playAgain = input("\nPlay again? (Y/N)").lower()
    if playAgain == "y":
      self.start()
    elif playAgain == "n":
      exit()
    else:
      print("Please choose Y or N")
      self.shouldPlayAgain()


  def start(self):
    self.__init__(getSearchTerm())
    while self.partialWordAsStr() != self.answer.value and self.guessesLeft > 0:
      guess = self.getInput(Msgs.inputPhrase,Msgs.dblLeterErrMsg)
      statusMsg = self.isGuessInAnswer(guess)
      partialWord = HangmanUI.partialWordAsUI(self)
      wGuesses = " ".join(self.wrongGuesses)
      HangmanUI.draw(self, partialWord, wGuesses, Msgs.getBanner(self), statusMsg, Msgs.getFooter(self))

    if self.guessesLeft == 0:
      status = Msgs.lost
    else:
      status = Msgs.won

    print(status)  
    self.shouldPlayAgain()

