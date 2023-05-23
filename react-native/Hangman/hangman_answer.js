class Result {
  bool; //bool;
  message; //str

  constructor() {
    this.bool = false;
    this.message = '';
  }
}

class AnswerResponse {
  _num_answer_words; //int;
  _answer_list; //list[str];
  _answer_words; //list[str];
  _numTotalLetters; //int;
  _numUniqueLetters; //int;
  num_syllables; //int;
  _answer_word_group; //str;
  search_term; //str;
  num_answers; //int;
  response_msg; //str;
  was_successful; //bool;
  max_syllables; //int;
  num_syllables_dict; //dict;

  __setOtherDefaults(word_group) {
    this._num_answer_words = this.get_num_answer_words(word_group);
    this._answer_words = this.get_answer_words(word_group);
    this._numTotalLetters = word_group.length;
    this._numUniqueLetters = Utils.getNumUniqueLetters(word_group);
  }

  set_word_group(word_group) {
    for (var letter of word_group) {
      if (!Utils.alpha_dict.hasOwnProperty(letter) && letter !== ' ') {
        throw new Error(
          'ERROR: somehow after all the REST calls and dbl-chking, this word group is not alpha + SPACE. ABORTING APPLICATION'
        );
      }
    }
    this._answer_word_group = word_group;
    this.__setOtherDefaults(word_group);
  }

  get_word_group() {
    return this._answer_word_group;
  }

  get_answer_words(word) {
    return word.split();
  }

  get_num_answer_words(word) {
    return this.get_answer_words(word).length;
  }
}

export class AnswerListProvider {
  constructor() {
    this.__get_answer_list = function () {
      let answerList = ['ardvark', 'baboon', 'cougar', 'dingo', 'door hinge'];
      return answerList;
    };

    this.get_answer_from_list = function () {
      let answer_list = this.__get_answer_list();
      return Utils.choose(answer_list);
    };

    this.isAxiosLoaded = function () {
      if (axios) {
        return true;
      } else {
        return false;
      }
    };
    this.getResponse = function (searchTerm) {
      //searchTerm = 'tree';
      let headers = {
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
      };
      let url =
        'https://api.datamuse.com/' +
        'words?' +
        ('rel_rhy=' + searchTerm + '&') +
        ('max=' + 1000 + '&'); //+

      //('&v=' + 'enwiki' + '&');
      let numLoops = 0;
      while (!this.isAxiosLoaded()) {
        if (numLoops > 100) {
          hm_view.printIHC('There appears to be some sort of server problem');
        }
        numLoops++;
      }
      /*     hmm.answer_response = new AnswerResponse();
      hmm.answer_response.response_msg = 'server request OK';
   */
      console.log('axios loaded');
      let test;
      return axios.get(url).catch((error) => {
        //hmm.answer_response.response_msg = error;
        //console.error(hmm.answer_response.response_msg);
      });
      /*
          except requests.exceptions.HTTPError as errh:
              print("\n\nHttp Error:", errh, "\n\n")
          except requests.exceptions.ConnectionError as errc:
              // print ("\n\nError Connecting:",errc,"\n\n")
              message = "\n\nThere's been an error connecting to the server.  Please try again in a few seconds."
          except requests.exceptions.Timeout as errt:
              print("\n\nTimeout Error:", errt, "\n\n")
          except requests.exceptions.RequestException as err:
              print("\n\nOops: Something Else", err, "\n\n")
          */
      //  console.error(error);
      //  message = error;
      //});
    };
  }
}
