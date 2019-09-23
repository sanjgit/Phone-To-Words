//var http = require('http');
var fs = require('fs');

//Read synchronous way -dictionary File
var array = fs.readFileSync('dictionary.txt').toString().split(/\r?\n/);


var uniqueWords = [];//get unique matching words from all the letters
var matchingWords = [];//Lists combination of letter which conains any of these unique words
var arrangedArrayList = [];//Lists combination of words with - seperated - 1st level of filter.
var phoneWordMap = [];//Actual list of combined words
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`Enter phone digits?`, (digit) => {
  console.log(`Words for  ${digit}!`);
  letterCombinations(digit);
});
/*getCombination- Method get combination of words from given letters 
                  and also checks the existance of word in dictionary
*/
function getCombinations(chars) {
  var result = [];
  if (chars.length < 1) return 0;
  if (chars.length < 2) return arr[0];

  result = [];
  var originalChar = chars.join('');
  var matchedArray = [];
  for (let i = 0; i < chars.length; i++) {
    const temp = [];
    for (let j = i; j < chars.length; j++) {
      temp.push(chars[j]);

      // if(temp.length>1){
      let strCat = temp.join('');
      result.push(strCat);
      let matchedDict = null;
      if (uniqueWords.indexOf(strCat) != -1) {
        matchedDict = strCat;
        if (matchedArray.indexOf(strCat) == -1) {
          matchedArray.push(strCat);
        }
      }
      else {
        matchedDict = matchDictionary(strCat);
      }
      if (matchedDict && matchedDict != -1 && uniqueWords.indexOf(strCat) == -1) {
        uniqueWords.push(strCat);
        if (strCat.length == originalChar.length && phoneWordMap.indexOf(strCat.toUpperCase()) == -1) {
          phoneWordMap.push(strCat.toUpperCase());
        }

      }

      // }
    }
  }
  if (matchedArray.length > 0 && matchedArray.length < 9) {
    if (matchedArray.join('').length >= originalChar.length && arrangedArrayList.indexOf(matchedArray.join('-')) == -1) {
      arrangedArrayList.push(matchedArray.join('-'));
      matchingWords.push(originalChar);
    }
  }
  return result;

}

function matchDictionary(word) {
  var match = array.filter(function (item) { return item === word; });
  return match.toString();
}
var map = [];
function getKey(ch) {
  for (let i = 0; i < Object.values(map).length; i++) {
    if (Object.values(map)[i].indexOf(ch) != -1) {
      return Object.keys(map)[i];
    }
  }
  return null;
}

//Generate letter combination mapping digits
function letterCombinations(digits) {

  if (isNaN(digits)) {
    console.log("Invalid Arguments");
    return;
  } 
  map = [];
  map[2] = "abc";
  map[3] = "def";
  map[4] = "ghi";
  map[5] = "jkl";
  map[6] = "mno";
  map[7] = "pqrs";
  map[8] = "tuv";
  map[9] = "wxyz";
  map[0] = "0";
  map[1] = "1";

  var result = [];

  if (digits == null || digits.length == 0)
    return result;

  var temp = [];
  getString(digits, temp, result, map);
  phone_To_Words(result);
  
}

//generate combination of chars based on digits
function getString(digits, temp, result, map) {
  if (digits.length == 0) {
    var arr = [];
    for (var i = 0; i < temp.length; i++) {
      arr[i] = temp[i];
    }   
    result.push(arr.join(''));
    return;
  }

  var curr = parseInt(digits.substring(0, 1));
  var letters = map[curr];
  for (var i = 0; i < letters.length; i++) {
    temp.push(letters.charAt(i));
    getString(digits.substring(1), temp, result, map);
    temp.pop();
  }
}


function phone_To_Words(list) {
  for (let i = 0; i < list.length; i++) {
    getCombinations(list[i].split(''));   
  }


  for (let i = 0; i < matchingWords.length; i++) {
    var wrd = matchingWords[i];
    var selectedWords = arrangedArrayList[i];
    var searchedWords = [];
    var count_mismatch = 0;
    var matchedLetters = "";
    var splitArray = selectedWords.indexOf('-') > -1 ? selectedWords.split('-') : selectedWords;
    if (splitArray.join('') === wrd && phoneWordMap.indexOf(wrd.toUpperCase()) == -1) {
      phoneWordMap.push(selectedWords.toUpperCase());
      continue;
    }
    for (let j = 0; j < wrd.length; j++) {
      let char_Match = selectedWords.indexOf(wrd[j]);
      let temp_matchedLetters = matchedLetters;
      if (char_Match == -1) {
        count_mismatch++;
        let key_Letter = getKey(wrd[j]);
        if (key_Letter) {
          searchedWords.push(key_Letter);
        }
      }
      else {

        if (count_mismatch > 0)
          matchedLetters = '';
        count_mismatch = 0;
        matchedLetters += wrd[j];
        if ((j + 1) < wrd.length) {
          let word_Match = selectedWords.indexOf(matchedLetters + wrd[j + 1]);
          if (word_Match == -1) {
            if (matchedLetters.length == 1) {
              let key_Letter = getKey(wrd[j]);
              if (key_Letter) {
                searchedWords.push(key_Letter);
                matchedLetters = '';
              }
            } else if (splitArray.indexOf(matchedLetters) != -1) {
              searchedWords.push(matchedLetters);
              matchedLetters = '';
            }
            //matchedLetters += wrd[j];            
          }
        }

      }
      if (count_mismatch == 2) {
        matchedLetters = '';
        searchedWords = [];
        break;
      }


    }
    if (searchedWords.length > 0) {
      if (matchedLetters.length == 1) {
        let key_Letter = getKey(matchedLetters);
        if (key_Letter) {
          searchedWords.push(key_Letter);
        }
      }
      else if (matchedLetters.length > 1 & (splitArray.indexOf(matchedLetters) != -1)) {
        searchedWords.push(matchedLetters);
      }
      if (searchedWords.join('').length == wrd.length && !/\d{2}/g.test(searchedWords.join('') ) && phoneWordMap.indexOf(searchedWords.join('-').toUpperCase()) == -1)
        phoneWordMap.push(searchedWords.join('-').toUpperCase());
    }
  }
 // console.log(uniqueWords);
 // console.log(matchingWords);
 // console.log(arrangedArrayList);
  if (phoneWordMap.length > 0) {
    console.log(phoneWordMap.join(','));
  }
  else {
    console.log("No Match Found, please try other options");
  }
  readline.close();
}

