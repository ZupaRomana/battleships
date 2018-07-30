"use strict";

import { Square } from "./Square.js";

export class GameBoard {
    constructor() {
        this.gameBoard = new Set();
        this.loadSquares();
    }

    loadSquares() {
        for (let yPos = 0; yPos < 10; yPos++) {
            for (let xPos = 0; xPos < 10; xPos++) {
                this.gameBoard.add(new Square(xPos, yPos));
            }
        }
    }

    getGameBoard() {
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("class", "game-board");
        for (let square of this.gameBoard) {
            gameBoard.appendChild(square.getHTMLSquare());
        }
        return gameBoard;
    }
}