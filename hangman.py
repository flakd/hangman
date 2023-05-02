from typing import Any
from hangman_ui import HangmanUI 
from hangman_classes import Hangman
from hangman_data import getSearchTerm


HangmanUI.showGameGreeting()

search_term = getSearchTerm()
hm = Hangman(search_term)
hm.initPartialWord()
hm.start()








  