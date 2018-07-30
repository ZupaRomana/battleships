"use strict";

import { Square } from "./Square.js";

export class GameBoard {
    constructor() {
        this.gameBoard = new Set();
        this.loadSquares();
    }

    loadSquares() {
        for (let xPos = 0; xPos < 10; xPos++) {
            for (let yPos = 0; yPos < 10; yPos++) {
                this.gameBoard.add(new Square(xPos, yPos));
            }
        }
    }

    getGameBoard() {
        return this.gameBoard;
    }
}