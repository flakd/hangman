import random
#from datamuse import Datamuse
import requests
import json
import string

class AnswerResponse:    
  _num_answer_words: int 
  _answer_words = []
  _numTotalLetters: int
  _numUniqueLetters: int
  _answer_word_group: str

  num_answers: int 
  response_msg: str
  was_successful: bool
  

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



class AnswerProvider:
  def __get_answerList(self) -> list[str]:
    answerList = ["ardvark", "baboon", "cougar", "dingo", "door hinge"]
    return answerList

  def get_answer_from_list(self) -> str:
    answer_list = self.__get_answerList()
    return random.choice(answer_list)  
  
  def get_answer(self, searchTerm, hm_ui):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'}
    url = "https://api.datamuse.com/words?rel_rhy=" + searchTerm + "&max=1000"
    answer_response = AnswerResponse()
    message: str
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
        num_answers = len(answer_list)
        answer_response.num_answers = num_answers
        if num_answers == 0:
          message = "Sorry I couldn't find any words that matched what you entered (" + searchTerm + ")"
        else:
          #max_syllables = max(answer_list, key=lambda mx: mx['numSyllables'])
          all_num_syllables = []
          for answer in answer_list:
            all_num_syllables.append(answer["numSyllables"])
          max_syllables = max(all_num_syllables)
          num_syllables_dict = dict()
          for num_syllables in range(max_syllables):
            num_syllables_dict[num_syllables+1] = []
          for answer in answer_list:
            num_syllables_dict[answer['numSyllables']].append(answer["word"]) 
          num_syllables_choice = hm_ui.get_num_syllables_choice(max_syllables)        
          answers_to_choose_from = num_syllables_dict[num_syllables_choice]
          answer_response.word_group = random.choice(answers_to_choose_from)      
          message = "There are " + str(len(answers_to_choose_from)) + " word(s) with " + \
            str(num_syllables_choice) + " syllables that rhyme with " + searchTerm + ". I'll randomly select one for you"

      answer_response.response_msg = message
      r.raise_for_status()
    except requests.exceptions.HTTPError as errh:
      print ("\n\nHttp Error:",errh,"\n\n")
    except requests.exceptions.ConnectionError as errc:
      #print ("\n\nError Connecting:",errc,"\n\n")
      message = "\n\nThere's been an error connecting to the server.  Please try again in a few seconds."
    except requests.exceptions.Timeout as errt:
      print ("\n\nTimeout Error:",errt,"\n\n")
    except requests.exceptions.RequestException as err:
      print ("\n\nOOps: Something Else",err,"\n\n")    

    return answer_response      


class HangmanUI:
  def get_num_syllables_choice(self,max_syllables) -> int:
    num_syllable_choice = ""
    isInt = False
    while not isInt: 
      num_syllable_choice = input(f"\nI have found words ranging from 2 to {max_syllables} syllables. How large a word do you want to guess (2-{max_syllables})?").lower()
      if Utils.is_string_an_int_between(num_syllable_choice,2,max_syllables):
        isInt = True
    return int(num_syllable_choice)
  
  def getSearchTerm(self) -> str:
    searchTerm = ""
    isString = False
    while not isString: 
      searchTerm = input("\nPick a rhyming word: ").lower()
      if Utils.is_whole_word_alpha(searchTerm):
        isString = True
    return searchTerm    


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
  _hm_UI: HangmanUI
  _answer: AnswerResponse
  _guess_letter: str
  _answer_provider: AnswerProvider
  _guesses_remaining: int
  _answer_guess: list[str]
  
  def __init__(self, answer_provider: AnswerProvider, hm_ui):
    self._hm_UI = hm_ui
    self._guesses_remaining = 6
    self._answer_provider = answer_provider
    
  def start(self) -> None:
    searchTerm = self._hm_UI.getSearchTerm()
    self._answer = self._answer_provider.get_answer(searchTerm, self._hm_UI)
    #self._answer = self._answer_provider.get_answer()
    if self._answer.num_answers == 0:
      print(self._answer.response_msg)
      self.start()
    else:
      print(self._answer.response_msg)
      print(self._answer.word_group)
    self._answer_guess = len(self._answer.word_group) * [""]
    while self._answer_guess != self._answer.word_group or self._guesses_remaining > 0:
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
    return self._guess_letter in self._answer.word_group

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
      for idx in range(len(self._answer.word_group)):
        if self._answer.word_group[idx] == self._guess_letter:
          self._answer_guess[idx] = self._guess_letter
      message = "Updated Guess-Answer: " + self.__get_answer_guess_as_UI()
    return message

  def __report_progress(self,progressMsg) -> None:
    print(progressMsg)
    pass 

ap = AnswerProvider()
hm_UI = HangmanUI()
hm = HangmanModel(ap, hm_UI)
hm.start()



