"use strict";

let mainContent = document.querySelector('#main-container');
import { GameBoard } from "./GameBoard.js";
let container = document.createElement("div");
container.setAttribute("class", "game-boards-container");
container.appendChild(new GameBoard().getGameBoard());
container.appendChild(new GameBoard().getGameBoard());
mainContent.appendChild(container);