"use strict";

import { GameBoard } from "./GameBoard.js";
let container = document.createElement("div");
container.setAttribute("class", "game-boards-container");
let gameBoards = [new GameBoard(), new GameBoard()]
container.appendChild(gameBoards[0].getGameBoard());
container.appendChild(gameBoards[1].getGameBoard());
container.addEventListener("click", () => {
    let squareContainers = document.getElementsByClassName("game-board");
    console.log(`Container -> Width: ${container.offsetWidth} Height: ${container.offsetHeight}`);
    for (let squareContainer of squareContainers) {
        console.log(`GameBoard -> Width: ${squareContainer.offsetWidth} Height: ${squareContainer.offsetHeight}`);
    }
})
document.body.appendChild(container);


function scaleGameBoardToBrowserZoomLevel() {
    let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    window.setInterval(() => {
    let multipler = browserZoomLevel / 100;
    if (browserZoomLevel > 100) {
        container.style.width = `${100 / multipler}%`;
        container.style.height = `${100 / multipler}%`;
    } else {
        container.style.width = `${100}%`;
        container.style.height = `${100}%`;
    }
    GameBoard.setSizeOfGameBoards(gameBoards);
    });
}

scaleGameBoardToBrowserZoomLevel();