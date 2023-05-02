class AnswerProvider:
  def get_answer() -> str:
    pass

class HangmanNew:  
  _answer: str
  _guess_remaining: int
  _answer_provider: AnswerProvider
  _answer_guess_state: list[str]
  
  def __init__(self, answer_provider: AnswerProvider):
    self._guess_remaining = 6
    self._answer_provider = answer_provider
    
  def start(self) -> None:
    self._answer = self._answer_provider.get_answer()
    self._answer_guess_state = len(self._answer) * [""]
    guess = self.get_guess()
    self.update_guess_state(guess)
    pass

  def get_guess() -> str:
    pass

  def update_guess_state(guess):
    pass

  def report_progress() -> None:
    pass 