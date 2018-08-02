"use strict";

import { Square } from "./Square.js";

export class GameBoard {
    constructor(isPlayer = true) {
        this.gameBoard = [];
        this.isPlayer = isPlayer;
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
                square.loadDiv();
                this.gameBoard.push(square);
            }
        }
    }

    getSquare(xPos, yPos) {

        for (let square of this.gameBoard) {
            if (square.xPos == xPos && square.yPos == yPos) {
                return square;
            }
        }
    }

    getGameBoard() {
        if (this.isPlayer) {
            return this.getPlayerGameBoard();
        } else {
            return this.getEnemyGameBoard();
        }
    }


    getGameBoardDiv() {
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("class", "game-board");
        for (let square of this.gameBoard) {
            let htmlSquare = square.getHTMLSquare();
            gameBoard.appendChild(htmlSquare);
        }
        return gameBoard;
    }

    getPlayerGameBoard(jsonArray) {

        if (jsonArray != null && jsonArray.gameBoard != null) {
            this.gameBoard = this.readSquaresFromArray(jsonArray.gameBoard);
        }

        let board = this.getGameBoardDiv();

        for (let i = 0; i < this.gameBoard.length; i++) {
            let square = this.gameBoard[i];
            square.isShip = this.gameBoard[i].isShip;
            if (square.isShip) {
                square.div.style.backgroundColor = "black";
            }
        }
        board.style.border = "2px solid black";
        return board;
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

    getEnemyGameBoard() {
        let gameBoard = this.getGameBoardDiv();

        for (let i = 0; i < this.gameBoard.length; i++) {
            let square = this.gameBoard[i];
            if (i % 2 === 0) {
                square.isShip = true;
            }
            this.setEnemyGameBoardColorAddEvent(square);
        }
        gameBoard.style.border = "2px solid black";
        return gameBoard;
    }

    setEnemyGameBoardColorAddEvent(square) {
        let htmlSquare = square.div;
        htmlSquare.style.backgroundColor = "cyan";
        let onClick = (e) => {
            console.log(`Width: ${htmlSquare.offsetWidth} Height: ${htmlSquare.offsetHeight}`);
            console.log(`xPos: ${square.xPos} yPos: ${square.yPos}`);

            if (square.isShip) {
                this.changeSquareToHit(square);
                this.changeCornerSquaresToMiss(square);
            } else {
                this.changeSquareToMiss(square);
            }
            if (square.isHit | square.isMiss) {
                htmlSquare.removeEventListener("click", onClick);
            }
        };
        htmlSquare.addEventListener("click", onClick);
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