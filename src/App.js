//REACT
import { useCallback, useEffect, useState } from 'react';

//COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//CSS
import './App.css';

//DATA
import { wordsList } from './data/words';

//GAME STAGES
const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];



function App() {

  //STATES
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(6);
  const [score, setScore] = useState(0);



  //PICK RANDON WORD AND CATEGORY ------------------------------------------------------------|
  const pickWordAndCategory = useCallback(() => {

    //Category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //Word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word }
  }, [words]);//------------------------------------------------------------------------------|



  //STARTS GAME ------------------------------------------------------------------------------|
  const startGame = useCallback(() => {
    //Clear all letters
    clearLetterStates();

    //Pick word and category
    const { category, word } = pickWordAndCategory();

    //Convert words to letters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //Fill States
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);//----------------------------------------------------------------|



  //PROCESS LETTER INPUT ---------------------------------------------------------------------|
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //Check if letter has already been utilized.
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    };

    //Push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };//----------------------------------------------------------------------------------------|



  //RESTARTS THE GAME ------------------------------------------------------------------------|
  const retry = () => {
    setScore(0)
    setGuesses(6);
    setGameStage(stages[0].name);
  };//----------------------------------------------------------------------------------------|



  //CLEAR LETTER STATES-----------------------------------------------------------------------|
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };//----------------------------------------------------------------------------------------|



  //CHECK IF GUESSES ENDED -------------------------------------------------------------------|
  useEffect(() => {
    if (guesses === 0) {
      clearLetterStates()
      setGameStage(stages[2].name);
    }
  }, [guesses]);
  //------------------------------------------------------------------------------------------|



  //WIN CONDITION ----------------------------------------------------------------------------|
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //Win condition
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      //Add score
      setScore((actualScore) => (actualScore += 100));
      //Restart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame, gameStage]);
  //------------------------------------------------------------------------------------------|



  //APP.JS
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickeWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
};

export default App;
