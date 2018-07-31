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


    getGameBoard() {
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("class", "game-board");
        for (let square of this.gameBoard) {
            let htmlSquare = square.getHTMLSquare();
            gameBoard.appendChild(htmlSquare);
        }
        return gameBoard;
    }

    getPlayerGameBoard() {
        let gameBoard = this.getGameBoard();
        let playerSquares = gameBoard.childNodes;
        for (let i = 0; i < playerSquares.length; i++) {
            let htmlSquare = playerSquares[i];
            let square = this.gameBoard[i];

            if (square.isShip) {
                htmlSquare.style.backgroundColor = "black";
            } else if (square.isMiss) {
                htmlSquare.style.backgroundColor = "white";
            }
        } 
        return gameBoard;
    }

    getEnemyGameBoard() {
        let gameBoard = this.getGameBoard();
        let enemySquares = gameBoard.childNodes;
        for (let i = 0; i < enemySquares.length; i++) {
            let square = this.gameBoard[i];
            if (i % 2 === 0) {
                square.isShip = true;
            }
            let htmlSquare = enemySquares[i]; 
            this.setEnemyGameBoardColorAddEvent(square, htmlSquare);
            
        }
        return gameBoard;
    }

    setEnemyGameBoardColorAddEvent(square, htmlSquare) {
        htmlSquare.style.backgroundColor = "cyan";
        let onClick = () => {
            
            console.log(`Width: ${htmlSquare.offsetWidth} Height: ${htmlSquare.offsetHeight}`);
            console.log(`xPos: ${square.xPos} yPos: ${square.yPos}`);

            if (square.isShip) {
                htmlSquare.style.border = "1px solid red";
                htmlSquare.style.backgroundColor = "#660000";
                square.isHit = true;
                this.changeCornersSquaresToMiss(square, htmlSquare);
            } else {
                htmlSquare.style.backgroundColor = "white";
                square.isMiss = true;
            }
            if (square.isHit | square.isMiss) {
                htmlSquare.removeEventListener("click", onClick);
            }
        };
        htmlSquare.addEventListener("click", onClick );
    }

    changeCornersSquaresToMiss(square) {
        let xPos = square.xPos;
        let yPos = square.yPos;
        for (let i = 0; i < this.gameBoard.length; i++) {
            let cornerSquare = this.gameBoard[i];
            if (this.squareIsCorner(xPos, yPos, cornerSquare)) {
                cornerSquare.div.style.backgroundColor = "white";
                cornerSquare.isMiss = true;
            }
        }
    }

    squareIsCorner(xPos, yPos, cornerSquare) {
        let rightXPos = cornerSquare.xPos - 1;
        let leftXPos = cornerSquare.xPos + 1;
        let topYPos = cornerSquare.yPos - 1;
        let bottomYPos = cornerSquare.yPos + 1;
        console.log(rightXPos === xPos | leftXPos === xPos) & (topYPos === yPos | bottomYPos === yPos);
        return (rightXPos === xPos | leftXPos === xPos) & (topYPos === yPos | bottomYPos === yPos);
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