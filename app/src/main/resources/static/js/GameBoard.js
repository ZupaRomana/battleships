"use strict";

import { Square } from "./Square.js";
import { Ship } from "./ship.js"
export class GameBoard {
    constructor(isPlayer = true) {
        this.gameBoard = [];
        this.isPlayer = isPlayer;
        this.isPlayerMove = true;
        this.loadSquares();
        this.getBoard = function () {
            return this.gameBoard;
        };
    }

    loadSquares() {
        for (let yPos = 0; yPos < 10; yPos++) {
            for (let xPos = 0; xPos < 10; xPos++) {
                let square = new Square();
                square.xPos = xPos;
                square.yPos = yPos;
                this.gameBoard.push(square);
            }
        }
    }

    getGameBoard(gameBoardUpdater, container) {
        if (this.isPlayer) {
            return this.getPlayerGameBoard(gameBoardUpdater);
        } else {
            return this.getEnemyGameBoard(gameBoardUpdater, container);
        }
    }


    getGameBoardDiv() {
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("class", "game-board");
        for (let square of this.gameBoard) {
            square.loadDiv();
            let htmlSquare = square.getHTMLSquare();
            gameBoard.appendChild(htmlSquare);
        }
        return gameBoard;
    }

    getPlayerGameBoard(gameBoardUpdater) {
        let json = JSON.parse(localStorage.getItem("map"));
        this.gameBoard = this.readSquaresFromArray(json.gameBoard);
        let gameBoard = this.getGameBoardDiv();
    
        for (let i = 0; i < this.gameBoard.length; i++) {
            let square = this.gameBoard[i];
            if (square.isShip) {
                square.div.style.backgroundColor = "black";
            }
        }
        gameBoard.style.border = "2px solid black"; 
        return gameBoard;
    }

    getEnemyGameBoard(gameBoardUpdater, container) {
        let enemyMap = localStorage.getItem("enemyMap");
        let json = JSON.parse(enemyMap);
        this.gameBoard = this.readSquaresFromArray(json.gameBoard);
        let gameBoard = this.getGameBoardDiv();
        
        console.log(enemyMap + " <-- enemy map getEnemyGameBoard()");
        
        for (let i = 0; i < this.gameBoard.length; i++) {
            console.log(this.gameBoard.length + "lenght");
            let square = this.gameBoard[i];
            this.setEnemyGameBoardColorAddEvent(square, gameBoardUpdater, container);
        }

        gameBoard.style.border = "2px solid black";
        return gameBoard;
    }

    setEnemyGameBoardColorAddEvent(square, gameBoardUpdater, container) {
        let htmlSquare = square.getHTMLSquare();
        htmlSquare.style.backgroundColor = "cyan";
        let onClick = (e) => {
            if (this.isPlayerMove) {
                if (square.isShip) {
                    this.changeSquareToHit(square);
                    this.changeCornerSquaresToMiss(square);
                } else {
                    this.changeSquareToMiss(square);
                    this.isPlayerMove = false;
                }
                if (square.isHit | square.isMiss) {
                    htmlSquare.removeEventListener("click", onClick);
                }
                gameBoardUpdater.postJSONToServer(gameBoardUpdater.parseGameBoardContainerToJSON(container));
            }
        };
        htmlSquare.addEventListener("click", onClick);

        htmlSquare.addEventListener("mouseover", () => {
            if (square.isHit | square.isMiss) {
                htmlSquare.removeEventListener("click", onClick);
            }
        });
    }

    getSquare(xPos, yPos) {

        for (let square of this.gameBoard) {
            if (square.xPos == xPos && square.yPos == yPos) {
                return square;
            }
        }
    }

    readSquaresFromArray(array) { 
        let gameBoard = []; 
        for (let i = 0; i < array.length; i++) { 
            let square = new Square(); 
            square.xPos = array[i].xPos; 
            square.yPos = array[i].yPos; 
            square.isShip = array[i].isShip; 
            square.loadDiv(); 
            gameBoard.push(square); 
        } 
        return gameBoard; 
    }

    changeCornerSquaresToMiss(square) {
        for (let i = 0; i < this.gameBoard.length; i++) {
            let cornerSquare = this.gameBoard[i];
            if (square.hasSquareOnCorner(cornerSquare) & !cornerSquare.isShip) {
                this.changeSquareToMiss(cornerSquare);
            }
        }
    }

    changeSquareToMiss(square) {
        square.isMiss = true;
        square.updateDivColor();
    }

    changeSquareToHit(square) {
        square.isHit = true;
        square.updateDivColor();
    }

    changeContainerSize(gameBoardsContainer, squareContainer, browserZoomLevel) {
        if (browserZoomLevel > 100) {  
            squareContainer.style.width = `${gameBoardsContainer.offsetWidth * 0.4}px`;
            squareContainer.style.height = `${gameBoardsContainer.offsetHeight * 0.6}px`;
        } else {
            squareContainer.style.width = `${40}%`;
            squareContainer.style.height = `${60}%`;
        }
    }

    static setSizeOfGameBoards(gameBoards) {
        let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        let gameBoardsContainer = document.getElementsByClassName("game-boards-container")[0];
        let squareContainers = document.getElementsByClassName("game-board");
    
        for (let i = 0; i < gameBoards.length; i++) {
            let squareContainer = squareContainers[i];
            let gameBoard = gameBoards[i];
            gameBoard.changeContainerSize(gameBoardsContainer, squareContainer, browserZoomLevel);
            for (let square of gameBoard.gameBoard) {
                square.changeSizeOfSquare(squareContainer.offsetWidth, squareContainer.offsetHeight, browserZoomLevel);
            }
        }
    }


}