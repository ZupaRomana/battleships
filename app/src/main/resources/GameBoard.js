"use strict";

import { Square } from "./Square.js";

export class GameBoard {
    constructor() {
        this.gameBoard = [];
        this.loadSquares();
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

    getPlayerGameBoard() {
        return this.getGameBoard();
    }

    getEnemyGameBoard() {
        let gameBoard = this.getGameBoard();
        let enemySquares = gameBoard.childNodes;
        for (let i = 0; i < enemySquares.length; i++) {//square of enemySquares) {
            let square = this.gameBoard[i];
            console.log(square);
            let htmlSquare = enemySquares[i]; 
            this.setEnemyGameBoardColorAddEvent(square, htmlSquare);
            
        }
        return gameBoard;
    }

    setEnemyGameBoardColorAddEvent(square, htmlSquare) {
        htmlSquare.style.backgroundColor = "cyan";
        htmlSquare.addEventListener("click", () => {
            alert(`x: ${square.xPos} y: ${square.yPos}`);
            htmlSquare.style.backgroundColor = "#ff3333";
            console.log(`Width: ${htmlSquare.offsetWidth} Height: ${htmlSquare.offsetHeight}`);
        });
    }

    getGameBoard() {
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("class", "game-board");
        for (let square of this.gameBoard) {
            let htmlSquare = square.getHTMLSquare();
            gameBoard.appendChild(htmlSquare);
        }
        return gameBoard;
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