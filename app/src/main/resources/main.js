"use strict";

import { GameBoard } from "./GameBoard.js";
import {Square} from "./Square.js";

let gameBoard = document.createElement("div");
gameBoard.setAttribute("class", "game-board");
let board = new GameBoard().getGameBoard();
for (let square of board) {
    gameBoard.appendChild(square.getHTMLSquare());
}
document.body.appendChild(gameBoard);