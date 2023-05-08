# %%
import random

# from datamuse import Datamuse
import requests
import json
import os
import string
from hangman_messages import Msgs


class Result:
    bool: bool
    message: str

    def __init__(
        self,
    ):
        self.bool = False
        self.message = ""


class AnswerResponse:
    _num_answer_words: int
    _answer_list: list[str]
    _answer_words: list[str]
    _numTotalLetters: int
    _numUniqueLetters: int
    num_syllables: int
    _answer_word_group: str
    search_term: str

    num_answers: int
    response_msg: str
    was_successful: bool
    max_syllables: int
    num_syllables_dict: dict

    def __setOtherDefaults(self, word_group):
        self._num_answer_words = self.get_num_answer_words(word_group)
        self._answer_words = self.get_answer_words(word_group)
        self._numTotalLetters = len(word_group)
        self._numUniqueLetters = Utils.getNumUniqueLetters(word_group)

    def set_word_group(self, word_group):
        for letter in word_group:
            if letter not in Utils.alpha_dict and letter != " ":
                print(
                    "ERROR: somehow after all the REST calls and dbl-chking, this word group is not alpha + SPACE"
                )
                print("ABORTING APPLICATION")
                exit()
        self._answer_word_group = word_group
        self.__setOtherDefaults(word_group)

    def get_word_group(self):
        return self._answer_word_group

    def get_answer_words(self, word) -> list[str]:
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

    def get_answer_response(self, searchTerm: str) -> AnswerResponse:
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
        }
        url = "https://api.datamuse.com/words?rel_rhy=" + searchTerm + "&max=1000"
        answer_response = AnswerResponse()
        message = ""
        temp_list = []
        try:
            r = requests.get(url, headers=headers, timeout=3)
            if r.status_code != 200:
                answer_response.was_successful = False
                message = "I couldn't find any results for the word you entered, or there is an issue with the server.  Please try again"
            else:
                # HTTP call was successful, but we don't know if we returned any results yet
                answer_response.was_successful = True
                json_data = json.loads(r.text)
                # print(json_data)
                for answer in json_data:
                    if "score" in answer and answer["score"] > 100:
                        temp_list.append(answer)

                temp_list.sort(key=lambda x: x["score"])
                print(temp_list)
                # print(json.dumps(json_data, indent=4))

                answer_list = []
                for wordGroup in temp_list:
                    answer_list.append(wordGroup)
                answer_response._answer_list = answer_list
            r.raise_for_status()
        except requests.exceptions.HTTPError as errh:
            print("\n\nHttp Error:", errh, "\n\n")
        except requests.exceptions.ConnectionError as errc:
            # print ("\n\nError Connecting:",errc,"\n\n")
            message = "\n\nThere's been an error connecting to the server.  Please try again in a few seconds."
        except requests.exceptions.Timeout as errt:
            print("\n\nTimeout Error:", errt, "\n\n")
        except requests.exceptions.RequestException as err:
            print("\n\nOops: Something Else", err, "\n\n")
        answer_response.response_msg = message
        return answer_response


class HangmanModel:
    answer_response: AnswerResponse
    _current_guess_letter: str
    _answer_provider: AnswerListProvider
    _guesses_remaining: int
    _answer_guess: list[str]
    _wrong_guesses: list[str]

    def __init__(self, answer_provider: AnswerListProvider):
        self._guesses_remaining = 6
        self._answer_provider = answer_provider

    def __init__(self):
        self._guesses_remaining = 6
        self._wrong_guesses = []

    def get_init_answer_guess(self):
        self._answer_guess = len(hmm.answer_response.get_word_group()) * [""]
        return self._answer_guess

    # 3
    def is_guess_already_in_answer_guess(self, guess: str) -> bool:
        result = Result()
        if guess in self._answer_guess:
            result.bool = True
            result.message = (
                "The letter '"
                + guess
                + "', is correct! But, you've guessed it before! Try again!\n"
            )
        else:
            result.bool = False
            result.message = None
        return result

    # 4
    def is_guess_a_previous_wrong_guess(self, guess: str) -> bool:
        result = Result()
        result.bool = False
        if guess in self._wrong_guesses:
            result.bool = True
            result.message = "Wrong! But, you've guessed it before! So, I won't penalize you again.\n"
        return result

    # 5
    def is_guess_in_answer(self, guess: str) -> bool:
        result = Result()
        result.bool = False
        self._current_guess_letter = guess
        result.bool = (
            self._current_guess_letter in self.answer_response._answer_word_group
        )
        if result.bool:
            wg = hmm.answer_response._answer_word_group
            for idx in range(len(wg)):
                if wg[idx] == self._current_guess_letter:
                    self._answer_guess[idx] = self._current_guess_letter
            # result.message = "Updated Guess-Answer: " + hm_UI.format_answer_guess_for_UI(self._answer_guess)
            result.message = (
                "The letter '"
                + guess
                + "', is correct! Good Guess! What will you guess next?\n"
            )
        else:
            result.message = "Sorry, that guess is wrong!\n"
        return result

    # 6
    def update_game_state(self, is_correct: bool, guess: str) -> None:
        message = ""
        if is_correct:
            wg = self.answer_response.get_word_group()
            for idx in range(len(wg)):
                if wg[idx] == guess:
                    self._answer_guess[idx] = guess
        else:
            self._guesses_remaining -= 1
            self._wrong_guesses.append(guess)
            message = str(self._guesses_remaining) + " guesses remaining!"
        return message

    def was_search_successful(self, searchTerm: str) -> bool:
        num_answers = len(hmm.answer_response._answer_list)
        hmm.answer_response.num_answers = num_answers
        if num_answers == 0:
            hmm.answer_response.was_successful = False
            message = (
                "Sorry I couldn't find any words that matched what you entered ("
                + searchTerm
                + ")"
            )
            return False
        else:
            hmm.answer_response.was_successful = True
            # max_syllables = max(answer_list, key=lambda mx: mx['numSyllables'])

            #  we want to get the range of syllables in these answer words.
            #  so we need the max number of syllables from whichever word
            #  has the most syllables. but we don't know which word that is.
            #
            #  so we will start by building an array of all the num syllables
            #  of all the words, then take the max() of that array.  Then 1 to
            #  this number is our range of all possible number of syllables
            all_num_syllables = []
            for answer in hmm.answer_response._answer_list:
                all_num_syllables.append(answer["numSyllables"])
            hmm.answer_response.max_syllables = max(all_num_syllables)

            #  now we want to sort/filter each word by the num syllables.  so
            #  we create a dict of string arrays of all possible num syllables
            #  (e.g. "1", "2", "3", "4", etc.).
            hmm.answer_response.num_syllables_dict = dict()
            for num_syllables in range(hmm.answer_response.max_syllables):
                hmm.answer_response.num_syllables_dict[num_syllables + 1] = []

            #  Now, we iterate over all possible ANSWER RESPONSES and place ONLY
            #  the WORDthem in the appropriate dict slot/appending them to the
            #  array in that slot
            for answer in hmm.answer_response._answer_list:
                hmm.answer_response.num_syllables_dict[answer["numSyllables"]].append(
                    answer["word"]
                )
            return True

    def choose_answer_from_answer_list(self, searchTerm, num_syllables_choice):
        self.answer_response.num_syllables = num_syllables_choice
        answers_to_choose_from = self.answer_response.num_syllables_dict[
            num_syllables_choice
        ]
        word_group = random.choice(answers_to_choose_from)
        hmm.answer_response.set_word_group(word_group)
        message = (
            "There are "
            + str(len(answers_to_choose_from))
            + " answer(s) to guess with "
            + str(num_syllables_choice)
            + " syllables that rhyme with "
            + searchTerm
            + ". I'll randomly select one for you"
        )
        hmm.answer_response.response_msg = message
        answer_guess = hmm.get_init_answer_guess()


class HangmanUI:
    def showGameGreeting(self):
        # Clearing the Screen
        os.system("clear")
        myText = """

        ==============================================
        =====     Welcome to Flak's Hangman!     =====
        ==============================================

        """
        print(myText)

    def init_new_game(self) -> None:
        hmm._answer_guess = hmm.get_init_answer_guess()
        hmm._guesses_remaining = 6
        hmm._wrong_guesses = []

    def start(self, hmm: HangmanModel, debug: bool) -> None:
        self.showGameGreeting()
        searchTerm = self.get_search_term_from_UI()
        hmm.answer_response = ap.get_answer_response(searchTerm)
        print(hmm.answer_response.response_msg)
        if not hmm.was_search_successful(searchTerm):
            self.start(hmm, debug)
        else:
            # search successful, let's narrow down the results
            num_syllables_choice = self.get_num_syllables_choice_from_UI(
                hmm.answer_response.max_syllables
            )
            hmm.choose_answer_from_answer_list(searchTerm, num_syllables_choice)
            print(hmm.answer_response.get_word_group())
            if debug:
                hmm.answer_response.set_word_group("test")
            self.__main_game_loop()

        print("leaving game now")
        exit()

    def __main_game_loop(self) -> None:
        self.init_new_game()
        statusMsg = "\n"
        isCorrect: bool

        my_guesses = "".join(hmm._answer_guess)
        answer = hmm.answer_response.get_word_group()
        final_guess_incorrrect = my_guesses != answer

        while final_guess_incorrrect and hmm._guesses_remaining > 0:
            self.draw(statusMsg)

            # 0
            guess = self.__get_guess_from_UI()
            statusMsg = self.validate_guess(guess)
            if statusMsg != "":
                continue

            # 5
            isCorrect = hmm.is_guess_in_answer(guess).bool

            statusMsg = hmm.is_guess_in_answer(guess).message

            # 6
            progressMsg = hmm.update_game_state(isCorrect, guess)
            statusMsg += progressMsg

            my_guesses = "".join(hmm._answer_guess)
            answer = hmm.answer_response.get_word_group()
            final_guess_incorrrect = my_guesses != answer

        self.draw(statusMsg)

        if hmm._guesses_remaining == 0:
            print(Msgs.lost)
        else:
            print(Msgs.won)

        if self.will_play_again():
            self.start(hmm, debug)

    def will_play_again(self) -> bool:
        statusMsg = ""
        will_play_again = input("Would you like to play again (Y/N)?").lower()
        while will_play_again != "y" and will_play_again != "n":
            print(statusMsg)
            will_play_again = input("Would you like to play again (Y/N)?").lower()
            # 1
            result = Utils.is_input_gt_one_char(will_play_again)
            if result:
                statusMsg = Msgs.dblLeterErrMsg
                continue
            # 2
            result = Utils.is_input_y_or_n(will_play_again)
            if not result.bool:
                statusMsg = result.message
                continue
        return will_play_again == "y"

    def validate_guess(self, guess) -> str:
        # 1
        if Utils.is_input_gt_one_char(guess):
            return Msgs.dblLeterErrMsg
        # 2
        if not Utils.is_input_an_alpha(guess).bool:
            return Utils.is_input_an_alpha(guess).message
        # 3
        elif hmm.is_guess_already_in_answer_guess(guess).bool:
            return hmm.is_guess_already_in_answer_guess(guess).message
        # 4
        elif hmm.is_guess_a_previous_wrong_guess(guess).bool:
            return hmm.is_guess_a_previous_wrong_guess(guess).message
        return ""

    def __get_guess_from_UI(self):
        print()
        print()
        guess = input(Msgs.inputPhrase).lower()
        print()
        return guess

    def format_answer_guess_for_UI(self):
        asUI = []
        for el in hmm._answer_guess:
            if el == "":
                asUI.append("_")
            else:
                asUI.append(el)
        return " ".join(asUI)

    def get_num_syllables_choice_from_UI(self, max_syllables) -> int:
        num_syllable_choice = ""
        isInt = False
        while not isInt:
            num_syllable_choice = input(
                f"\nI have found answers to guess ranging from 1 to {max_syllables} syllables. How large a word do you want to guess (1-{max_syllables})? "
            ).lower()
            if Utils.is_string_an_int_between(num_syllable_choice, 1, max_syllables):
                isInt = True
        return int(num_syllable_choice)

    def get_search_term_from_UI(self) -> str:
        searchTerm = ""
        isString = False
        while not isString:
            searchTerm = input("\nPick a rhyming word: ").lower()
            if Utils.is_whole_word_alpha(searchTerm):
                isString = True
        return searchTerm

    def draw(self, msg):
        pWord = self.format_answer_guess_for_UI()
        wGuesses = " ".join(hmm._wrong_guesses)
        banner = Msgs.getBanner(hmm)
        footer = Msgs.getFooter(hmm)

        # Clearing the Screen
        os.system("clear")
        print(banner, footer)
        print()

        bodyPartsHead = "   "
        bodyPartsTorso = "   "
        bodyPartsLegs = "   "

        if hmm._guesses_remaining < 6:
            bodyPartsHead = " O "
        if hmm._guesses_remaining == 4:
            bodyPartsTorso = " | "
        if hmm._guesses_remaining == 3:
            bodyPartsTorso = "/| "
        if hmm._guesses_remaining <= 2:
            bodyPartsTorso = "/|\\"
        if hmm._guesses_remaining == 1:
            bodyPartsLegs = "/  "
        if hmm._guesses_remaining == 0:
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


class Utils:
    alpha_dict_lower = dict.fromkeys(string.ascii_lowercase, 0)
    # alpha_dict_upper = dict.fromkeys(string.ascii_uppercase, 0)
    alpha_dict = dict()
    # alpha_dict[" "] = 0
    alpha_dict.update(alpha_dict_lower)
    # alpha_dict.update(alpha_dict_upper)

    # 1.b.
    def is_input_y_or_n(input: str) -> Result:
        result = Result()
        if not input in ["y", "n"]:
            result.bool = False
            result.message = Msgs.y_or_n_only
        return result

    # 1
    def is_input_gt_one_char(input: str) -> bool:
        return len(input) > 1

    # 2
    def is_input_an_alpha(input: str) -> bool:
        result = Result()
        if input not in Utils.alpha_dict.keys():
            result.bool = False
            result.message = (
                "the char '"
                + input
                + "', is not an alphabetic letter. Please try again!\n"
            )
        else:
            result.bool = True
            result.message = None
        return result

    def is_whole_word_alpha(word) -> bool:
        is_alpha = True
        for letter in word:
            if letter not in Utils.alpha_dict:
                is_alpha = False
        return (
            is_alpha
            and word != " "
            and not word.isnumeric()
            and word != None
            and word != ""
            and word.strip() != ""
        )

    def is_string_an_int_between(word: str, firstNum: int, secondNum: int) -> bool:
        is_between = False
        if word.isnumeric():
            if int(word) >= firstNum and int(word) <= secondNum:
                is_between = True
        return is_between

    def getNumUniqueLetters(word) -> int:
        for letter in word:
            try:
                Utils.alpha_dict[letter] += 1
            except:
                print(f"The key ['{letter}'] is missing in alphaDict")
        numUniqueLetters = 0
        for el in Utils.alpha_dict:
            if Utils.alpha_dict[el] > 0:
                numUniqueLetters += 1
        return numUniqueLetters


debug = True
ap = AnswerListProvider()
hmm = HangmanModel()
hm_UI = HangmanUI()
hm_UI.start(hmm, debug)

# %%
