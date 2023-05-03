import random
#from datamuse import Datamuse
import requests
import json

class AnswerResponse:
  num_answers: int 
  word_group: str
  response_msg: str
  was_successful: bool

class AnswerProvider:
  def __get_answerList(self) -> list[str]:
    answerList = ["ardvark", "baboon", "cougar", "dingo", "door hinge"]
    return answerList

  def get_answer_from_list(self) -> str:
    answer_list = self.__get_answerList()
    return random.choice(answer_list)  
  
  def get_answer(self, searchTerm):
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
          num_syllables_choice = self.__get_num_syllables_choice(max_syllables)        
          answers_to_choose_from = num_syllables_dict[num_syllables_choice]
          answer_response.word_group = random.choice(answers_to_choose_from)      
          message = "There are " + str(len(answers_to_choose_from)) + " word(s) with " + \
            str(num_syllables_choice) + " that rhyme with " + searchTerm + ". I'll randomly select one for you"

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

  def __get_num_syllables_choice(self,max_syllables) -> int:
    num_syllable_choice = ""
    test = False
    while not test: 
      num_syllable_choice = input(f"I have found words ranging from 2 to {max_syllables} syllables. How large a word do you want to guess (2-{max_syllables})?")
      if num_syllable_choice.isnumeric():
        if int(num_syllable_choice) >= 2 or int(num_syllable_choice) <= max_syllables:
          test = True
    return int(num_syllable_choice)
  

class HangmanNew:  
  _answer: AnswerResponse
  _guess_letter: str
  _answer_provider: AnswerProvider
  _guesses_remaining: int
  _answer_guess: list[str]
  
  def __init__(self, answer_provider: AnswerProvider):
    self._guesses_remaining = 6
    self._answer_provider = answer_provider
    
  def start(self) -> None:
    searchTerm = self.__getSearchTerm()
    self._answer = self._answer_provider.get_answer(searchTerm)
    #self._answer = self._answer_provider.get_answer()
    if self._answer.num_answers == 0:
      print(self._answer.response_msg)
      self.start()
    else:
      print(self._answer.word_group)
    self._answer_guess = len(self._answer.word_group) * [""]
    while self._answer_guess != self._answer.word_group or self._guesses_remaining > 0:
      self.__main_game_loop()

  def __main_game_loop(self) -> None:
    guess = self.__get_guess()
    isCorrect = self.__is_guess_in_answer()
    progressMsg = self.__update_game_state(isCorrect)
    self.__report_progress(progressMsg)

  def __getSearchTerm(self):
    searchTerm = input("\nPick a rhyming word: ")
    return searchTerm  
  
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
hm = HangmanNew(ap)
hm.start()



