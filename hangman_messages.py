class Msgs:
    inputPhrase = "Please guess a letter: "
    dblLeterErrMsg = "ONLY ONE letter allowed. Guess again: \n"
    lost = "\nSorry, YOU LOST!"
    won = "\nCONGRATULATIONS, YOU WON!"

    @staticmethod
    def getBanner(hm):
        banner = (
            "Your answer has: \n"
            + str(hm.answer_response._numTotalLetters)
            + " letters total ("
            + str(hm.answer_response._numUniqueLetters)
            + " Unique),"
        )
        return banner

    @staticmethod
    def getFooter(hm):
        plural = "s"
        if hm.answer_response._num_answer_words == 1:
            plural = ""
        footer = (
            str(hm.answer_response._num_answer_words)
            + " Word"
            + plural
            + " & "
            + str(hm.answer_response.num_syllables)
            + " Syllables."
        )
        return footer
