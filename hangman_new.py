import random

class AnswerProvider:
  def __get_answerList(self) -> list[str]:
    answerList = ["ardvark", "baboon", "cougar", "dingo", "door hinge"]
    return answerList

  def get_answer(self) -> str:
    answer_list = self.__get_answerList()
    return random.choice(answer_list)  
  

class HangmanNew:  
  _answer: str
  _guess_letter: str
  _answer_provider: AnswerProvider
  _guesses_remaining: int
  _answer_guess: list[str]
  
  def __init__(self, answer_provider: AnswerProvider):
    self._guesses_remaining = 6
    self._answer_provider = answer_provider
    
  def start(self) -> None:
    self._answer = self._answer_provider.get_answer()
    print(self._answer)
    self._answer_guess = len(self._answer) * [""]
    while self._answer_guess != self._answer or self._guesses_remaining > 0:
      self.__main_game_loop()

  def __main_game_loop(self) -> None:
    guess = self.__get_guess()
    isCorrect = self.__is_guess_in_answer()
    progressMsg = self.__update_game_state(isCorrect)
    self.__report_progress(progressMsg)

  def __get_guess(self) -> str:
    self._guess_letter = input("Please guess a letter: ")
    pass

  def __is_guess_in_answer(self) -> bool:
    return self._guess_letter in self._answer

  def __have_guessed_correct_before():
    pass

  def __have_guessed_incorrect_before():
    pass

  def __get_answer_guess_as_UI(self):
    asUI = []
    for el in self._answer_guess:
      if el == "":
        asUI.append("_")
      else:
        asUI.append(el)        
    return " ".join(asUI)

  def __update_game_state(self, isCorrect: bool) -> None:
    if not self.__is_guess_in_answer():
      self._guesses_remaining -= 1
      message = "Wrong! You have " + str(self._guesses_remaining) + " guesses remaining."
    else:
      for idx in range(len(self._answer)):
        if self._answer[idx] == self._guess_letter:
          self._answer_guess[idx] = self._guess_letter
      message = "Updated Guess-Answer: " + self.__get_answer_guess_as_UI()
    return message

  def __report_progress(self,progressMsg) -> None:
    print(progressMsg)
    pass 

ap = AnswerProvider()
hm = HangmanNew(ap)
hm.start()



