import random
from datamuse import Datamuse


def getAnswerList():
  #randomWords = ["ardvark", "baboon", "cougar", "dingo", "door hinge"]
  answerList = ["door hinge"]
  return answerList

def getRandomAnswer(searchTerm):
  #return random.choice(getAnswerList())
  api = Datamuse()
  wordsData = api.words(rel_rhy=searchTerm)
  print(wordsData)
  #wordsJSON = json.loads(wordsData)
  #for words in wordsJSON:
  wordArray = []
  for words in wordsData:
    #print(words["word"])
    wordArray.append(words["word"])
  length = len(wordArray)
  print(length)
  word = random.choice(wordArray)
  print(word)  
  return word