from typing import Any
from hangman_ui import HangmanUI 
from hangman_classes import Hangman
from hangman_messages import Msgs
import requests
#import pip._vendor.requests
import json


searchTerm = input("\nPick a rhyming word: ")
hm = Hangman(searchTerm)
HangmanUI.showGameGreeting()
hm.initPartialWord()

hm.start()