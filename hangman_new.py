import random
#from datamuse import Datamuse
import requests
import json
import string

class AnswerResponse:    
  _num_answer_words: int 
  _answer_list: list[str]
  _answer_words: list[str]
  _numTotalLetters: int
  _numUniqueLetters: int
  _answer_word_group: str
  search_term:str

  num_answers: int 
  response_msg: str
  was_successful: bool
  max_syllables: int
  num_syllables_dict: dict

  def __setOtherDefaults(self,word_group):  
    self._num_answer_words = self.get_num_answer_words(word_group)
    self._answer_words = self.get_answer_words(word_group)
    self._numTotalLetters = len(word_group)
    self._numUniqueLetters = Utils.getNumUniqueLetters(word_group)   

  def set_word_group(self, word_group):
    for letter in word_group:
      if letter not in Utils.alphaDict:
        print("ERROR: somehow after all the REST calls and dbl-chking, this word group is not alpha + SPACE")
        print("ABORTING APPLICATION")
        exit()
    self._answer_word_group = word_group
    self.__setOtherDefaults(word_group)

  def get_word_group(self):
    return self._answer_word_group
 
  def get_answer_words(self,word) -> list[str]:
    return word.split()
    
  def get_num_answer_words(self, word) -> int:
    return len(self.get_answer_words(word))


class AnswerListProvider:
  def __get_answer_list(self) -> list[str]:
    answerList = ["ardvark", "baboon", "cougar", "dingo", "door hinge"]
    return answerList

  def get_answer_from_list(self) -> str:
    answer_list = self.__get_answer_list()
    return random.choice(answer_list)  
  
  def get_answer_response(self, searchTerm:str) -> AnswerResponse:
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'}
    url = "https://api.datamuse.com/words?rel_rhy=" + searchTerm + "&max=1000"
    answer_response = AnswerResponse()
    message = ""
    temp_list= []
    try:
      r = requests.get(url, headers=headers, timeout=3)
      if r.status_code != 200:
        answer_response.was_successful = False
        message = "I couldn't find any results for the word you entered, or there is an issue with the server.  Please try again"
      else:
        # HTTP call was successful, but we don't know if we returned any results yet      
        answer_response.was_successful = True
        json_data = json.loads(r.text)        
        #print(json_data)
        for answer in json_data:
          if "score" in answer and answer["score"] > 100:
            temp_list.append(answer)
        
        temp_list.sort(key=lambda x: x["score"])
        print(temp_list)
        #print(json.dumps(json_data, indent=4))          

        answer_list = []
        for wordGroup in temp_list:
          answer_list.append(wordGroup)
        answer_response._answer_list = answer_list
      r.raise_for_status()
    except requests.exceptions.HTTPError as errh:
      print ("\n\nHttp Error:",errh,"\n\n")
    except requests.exceptions.ConnectionError as errc:
      #print ("\n\nError Connecting:",errc,"\n\n")
      message = "\n\nThere's been an error connecting to the server.  Please try again in a few seconds."
    except requests.exceptions.Timeout as errt:
      print ("\n\nTimeout Error:",errt,"\n\n")
    except requests.exceptions.RequestException as err:
      print ("\n\nOops: Something Else",err,"\n\n")  
    answer_response.response_msg = message  
    return answer_response      
  

class Utils:
  alphaDict = dict.fromkeys(string.ascii_lowercase, 0)
  alphaDict[" "] = 0

  def is_whole_word_alpha(word) -> bool: 
    is_alpha = True
    for letter in word:
      if letter not in Utils.alphaDict:
        is_alpha = False
    return is_alpha and word != " " and \
        not word.isnumeric() and word != None \
        and word != "" and word.strip() != ""
  
  def is_string_an_int_between(word:str, firstNum:int, secondNum:int) -> bool:
    is_between = False
    if word.isnumeric():
      if int(word) >= firstNum and int(word) <= secondNum:
        is_between = True
    return is_between
      
  def getNumUniqueLetters(word) -> int:
      for letter in word:
        try:
          Utils.alphaDict[letter] += 1
        except:
          print(f"The key ['{letter}'] is missing in alphaDict")
      numUniqueLetters = 0
      for el in Utils.alphaDict:
        if Utils.alphaDict[el] > 0:
          numUniqueLetters += 1
      return numUniqueLetters

class HangmanModel:  
  _answer: AnswerResponse
  _guess_letter: str
  _answer_provider: AnswerListProvider
  _guesses_remaining: int
  _answer_guess: list[str]
  
  def __init__(self, answer_provider: AnswerListProvider):
    self._guesses_remaining = 6
    self._answer_provider = answer_provider

  def is_guess_in_answer(self) -> bool:
    return self._guess_letter in self._answer.word_group

  def update_game_state(self, isCorrect: bool) -> None:
    if not self.__is_guess_in_answer():
      self._guesses_remaining -= 1
      message = "Wrong! You have " + str(self._guesses_remaining) + " guesses remaining."
    else:
      for idx in range(len(self._answer.word_group)):
        if self._answer.word_group[idx] == self._guess_letter:
          self._answer_guess[idx] = self._guess_letter
      message = "Updated Guess-Answer: " + self.__get_answer_guess_as_UI()
    return message
  
  def was_search_successful(self, answer_response:AnswerResponse, searchTerm:str) -> bool:
    num_answers = len(answer_response)
    answer_response.num_answers = num_answers
    if num_answers == 0:
      answer_response.was_successful = False
      message = "Sorry I couldn't find any words that matched what you entered (" + searchTerm + ")"
    else:
      answer_response.was_successful = True
      #max_syllables = max(answer_list, key=lambda mx: mx['numSyllables'])
      all_num_syllables = []
      for answer in answer_response._answer_list:
        all_num_syllables.append(answer["numSyllables"])
      answer_response.max_syllables = max(all_num_syllables)
      answer_response.num_syllables_dict = dict()
      for num_syllables in range(answer_response.max_syllables):
        answer_response.num_syllables_dict[num_syllables+1] = []
      for answer in answer_response._answer_list:
        answer_response.num_syllables_dict[answer['numSyllables']].append(answer["word"])
    return answer_response
  
  
class HangmanUI:
  _hmm: HangmanModel
  _ap: AnswerListProvider

  def start(self, hmm:HangmanModel) -> None:
    searchTerm = self.get_search_term_UI()
    answer_response = hmm._answer_provider.get_answer_response(searchTerm)
    if not hmm.was_search_successful(answer_response):
      print(answer_response.response_msg)
      self.start()
    else:
      print(answer_response.response_msg)
      max_syllables = answer_response.max_syllables
      # search successful, let's narrow down the results
      num_syllables_choice = self.get_num_syllables_choice_UI(max_syllables)        
      answers_to_choose_from = answer_response.num_syllables_dict[num_syllables_choice]
      word_group = random.choice(answers_to_choose_from)
      answer_response.set_word_group(word_group)      
      message = "There are " + str(len(answers_to_choose_from)) + " word(s) with " + \
        str(num_syllables_choice) + " syllables that rhyme with " + searchTerm + ". I'll randomly select one for you"

      answer_response.response_msg = message  


      print(answer_response.get_word_group)

    answer_guess = len(answer_response.get_word_group) * [""]
    while answer_guess != answer_response.get_word_group or hmm._guesses_remaining > 0:
      self.__main_game_loop(hmm, ap)

  def __main_game_loop(self, hmm:HangmanModel, ap:AnswerListProvider) -> None:
    guess = self.__get_guess_UI()
    isCorrect = hmm.is_guess_in_answer()
    progressMsg = hmm.update_game_state(isCorrect)
    self.__report_progress(progressMsg)

  def __get_guess_UI(self) -> str:
    self._guess_letter = input("Please guess a letter: ")

  def __get_answer_guess_UI(self):
    asUI = []
    for el in self._answer_guess:
      if el == "":
        asUI.append("_")
      else:
        asUI.append(el)        
    return " ".join(asUI)

  def get_num_syllables_choice_UI(self,max_syllables) -> int:
    num_syllable_choice = ""
    isInt = False
    while not isInt: 
      num_syllable_choice = input(f"\nI have found words ranging from 2 to {max_syllables} syllables. How large a word do you want to guess (2-{max_syllables})?").lower()
      if Utils.is_string_an_int_between(num_syllable_choice,2,max_syllables):
        isInt = True
    return int(num_syllable_choice)
  
  def get_search_term_UI(self) -> str:
    searchTerm = ""
    isString = False
    while not isString: 
      searchTerm = input("\nPick a rhyming word: ").lower()
      if Utils.is_whole_word_alpha(searchTerm):
        isString = True
    return searchTerm 
  
  def __report_progress(self,progressMsg:str) -> None:
    print(progressMsg)
    pass 


ap = AnswerListProvider()
hmm = HangmanModel(ap)
hm_UI = HangmanUI()
hm_UI.start(hmm)



