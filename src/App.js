import React, { useEffect, useCallback } from 'react';
import {useState} from 'react';
import classes from './App.module.css';
import Board from './components/Board';
import Gameboard from './factories/Gameboard';
import ShipFactory from './factories/ShipFactory';
import Ship from './components/Ship';
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';


function App() {

  ////////////STATES////////////

  const placeShips = useCallback(() => {
    let shipsArray = [];
    for (let i=0; i<5; i++) {
      shipsArray.push(ShipFactory(i))
    }
    return shipsArray
  })

  const [ gameState, setGameState ] = useState({
    isPlaying: false,
    activePlayer: null,
    winner: null
  })

  const [ playerState, setPlayerState ] = useState({ 
    playerBoard: Gameboard(), 
    playerShips: [],
    containerShips: placeShips()
    })
  
  const [ computerState, setComputerState ] = useState({
    computerBoard: Gameboard(),
    computerShips : placeShips()
  })

  //////////////////////////////

  const computerAttackHandler = useCallback(() => {
    if (gameState.isPlaying && gameState.activePlayer === "computer"){
       let targetIndex =  playerState.playerBoard.aiAttackHandler(playerState.playerShips)
       //console.log(targetIndex);

       //Attack handler mark the target grid ID as hit= true,
       //return true if the ID contained ship -> continue attacking
       let shipHitted = playerState.playerBoard.attackHandler(targetIndex);
       

       if (shipHitted !== false){
         //console.log('HITTED USERS SHIP')
         playerState.playerShips[shipHitted].hitShip()

         setGameState({
          winner: null,
          isPlaying: true,
          activePlayer: "computer"
        })

        if (playerState.playerShips[shipHitted].ship.sunk) gameOverHandler()

       } else {
         //console.log('FAILED TO HIT USERS SHIP')
        setGameState({
          winner: null,
          isPlaying: true,
          activePlayer: "user"
       })
    } 
  }}
)
  //COMPONENT DID UPDATE - based on activePlayer
  useEffect(() => {
    if (gameState.isPlaying && gameState.activePlayer === "computer"){
      //console.log("COMPUTER ATTACK EFFECT")
      let timer = setTimeout(() => {
      computerAttackHandler()
    }, 1000)
    return () => { 
      clearTimeout(timer)
    }
    }
  }, [gameState.activePlayer, gameState.isPlaying, computerAttackHandler]);


  const gameOverHandler = () => {
      let computerWinner = playerState.playerShips.every( ship => ship.ship.sunk === true);
      let playerWinner = computerState.computerShips.every( ship => ship.ship.sunk === true);
      console.log('GAME OVER HANDLER')
      console.log(computerWinner);
      console.log(playerWinner);
      if (computerWinner){
        setGameState({
          winner: 'computer',
          isPlaying: false
          })
      }

      if (playerWinner){
        setGameState({
          winner: 'user',
          isPlaying: false
          })
      }
  }

  const flipShipOrientation = () => {
    //console.log("FLIP");
    playerState.containerShips.forEach(ship =>{
      ship.flipShip()
    })
    setPlayerState(prevState => ({
      ...prevState
    }))
  }

  const dropShipHandler = (item, target) => {
    //console.log(item)
    //console.log(target)

    playerState.containerShips.forEach(ship => {
      //console.log(ship.ship.name[2])
      if (ship.ship.name[2] === item.id[0]){
        //console.log (ship.ship.name)
        
        //Check if it is possible to put the boat on the grid -> gridIndex(0-99), shipIndex(0-4) , shipLen(1-5), orientation (X/Y)
        if (playerState.playerBoard.freeIndexController(target, item.id[1], ship.ship.length, ship.ship.orientation) === true) {
          ship.ship.placed = true;

          let n = ship.ship.orientation === "X" ? 1 : 10

          ship.ship.firstIndex = target - (item.id[1] * n)
          //ship.ship.id = playerState.containerShips.indexOf(ship)
          ship.ship.id = playerState.playerShips.length;

          playerState.playerBoard.placeShips(ship)

          setPlayerState(prevState => ({
            ...prevState,
            playerShips : [...prevState.playerShips, ship],
            containerShips: prevState.containerShips.filter(item => item !== ship)
          }))
        }
      }
    })
  }

  const placeComputerShips = () => {
    computerState.computerShips.forEach(ship => {
      while (ship.ship.placed !== true){
        let randomIndex = Math.floor(Math.random()*100)
        let randomOrientation = Math.floor(Math.random()*10) < 5 ? "X" : "Y"
        if (computerState.computerBoard.freeIndexController(randomIndex, 0, ship.ship.length, randomOrientation) === true){
          ship.ship.firstIndex = randomIndex;
          ship.ship.orientation = randomOrientation;
          ship.ship.placed = true;
          computerState.computerBoard.placeShips(ship)
        }  
      }
    })
  }

  const startGameHandler = () => {
    if (playerState.containerShips.length === 0){
      console.log('START PLAYING')
      //randomly place computer ships !
      placeComputerShips();
      
      setGameState({
        winner: null,
        isPlaying: true,
        activePlayer: "user"
      })
    } else console.log('PLACE ALL SHIPS')
  }

  const resetGameHandler = () => {
    window.location.reload();
    return false;
  }

  const playerAttackHandler = (target) => {
    //console.log(target)

    //Check if is the user allowed to attack && check dupplicate attack
    if (gameState.isPlaying && gameState.activePlayer === "user"){
      if (computerState.computerBoard.duplicateAttackHandler(target)){
        let shipHitted = computerState.computerBoard.attackHandler(target);

        if (shipHitted !== false){
          computerState.computerShips[shipHitted].hitShip()
          computerState.computerBoard.checkSunkedShips(computerState.computerShips)

          setGameState({
          winner: null,
          isPlaying: true,
          activePlayer: "user"
        })
          if (computerState.computerShips[shipHitted].ship.sunk) gameOverHandler()

        } else {
          setGameState({
            winner: null,
            isPlaying: true,
            activePlayer: "computer"
          })
        }
      }
    }
  }

let flipButton = playerState.containerShips.length > 0 ? 
                    <button className={classes.flipBtn} onClick={flipShipOrientation}> FLIP</button> :
                    null;

let containerBoard = gameState.winner === null ? 
        <div className={ gameState.isPlaying? [classes.Container, classes.Disable].join(' ') : classes.Container } >
            <Ship ship={playerState.containerShips[0]}  />
            <Ship ship={playerState.containerShips[1]}  />
            <Ship ship={playerState.containerShips[2]}  />
            <Ship ship={playerState.containerShips[3]}  />
            <Ship ship={playerState.containerShips[4]}  />
            {flipButton}
        </div> : gameState.winner === "user" ? <h2 className={classes.winner} > All computers boats have been sunk. You won! </h2> :
                gameState.winner === "computer" ? <h2 className={classes.winner} > All your boats have been sunk. You lost! </h2> : null;


  return (
    <DndProvider backend={HTML5Backend} >
      <div className={classes.gameContainer} >
        
        
        <div className={classes.gameProperties}> 
          <h1>Battleship </h1>
          <h2>Player:</h2>
          <h2>Computer:</h2>
          <div className={classes.boardContainer}>
            <Board 
              dropped = {(item, target)=>dropShipHandler(item, target)}
              ships={playerState.playerShips} 
              type={"grid"}
              grid={playerState.playerBoard.getGrid()} 
              />
            <Board 
              clicked = {target => playerAttackHandler(target)}
              grid={computerState.computerBoard.getGrid()}
              type={"computer"}
              ships={computerState.computerShips}  
              />
          </div> 
        </div>

      {containerBoard}
      {gameState.winner === null ? <button className={ gameState.isPlaying? [classes.startBtn, classes.DisableBtn].join(' '): classes.startBtn } 
                onClick={startGameHandler}> 
                Start game 
        </button> : null}
        
        <button className={classes.resetBtn} onClick={resetGameHandler}> Reset</button>
      </div>
      
      </DndProvider>

    
  );
}

export default App;
