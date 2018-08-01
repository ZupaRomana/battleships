"use strict";
import { Ship } from "./ship.js";
import { GameBoard } from "./GameBoard.js";

showTactics();
function showTactics() {
    let mainContainer = document.getElementById("main-container");

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.textContent = "RESET";

    let gameboard = new GameBoard();
    let map = gameboard.getPlayerGameBoard();
    mainContainer.appendChild(resetButton);

    mainContainer.appendChild(map);
    resetButton.addEventListener("click", function () {
        let newGameBoard = resetMap(gameboard, mainContainer);
        resetShips(newGameBoard);
    });

    createShipsContainer(mainContainer);

}
function resetMap(gameboard, mainContainer) {
    
    mainContainer.removeChild(document.querySelector(".game-board"));
    let newGameBoard = new GameBoard();
    let newMap = newGameBoard.getPlayerGameBoard();
    mainContainer.appendChild(newMap);
    let container = document.querySelector("#shipsContainer");
    container.remove();
    createShipsContainer(mainContainer);
    return newGameBoard;
}

function createShipsContainer(mainContainer) {
    let container = document.createElement("div");
    container.setAttribute("id", "myContainer");
    let shipsContainer = document.createElement("div");
    shipsContainer.setAttribute("id", "shipsContainer");
    let title = document.createElement("div");
    title.setAttribute("id", "header");
    shipsContainer.appendChild(title);
    title.textContent = "Your ships";
    mainContainer.appendChild(shipsContainer);
}


function resetShips(map) {

    [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].forEach(element => {
        let ship = new Ship(element, map);
        ship.resetShip();
    });
    document.getElementById("resetButton").setAttribute("disabled", true);
}