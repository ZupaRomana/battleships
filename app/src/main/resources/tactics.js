"use strict";
import { Ship } from "./ship.js";
import { GameBoard } from "./GameBoard.js";

showTactics();
function showTactics() {
    let mainContainer = document.getElementById("main-container");
    // document.body.appendChild(mainContainer);

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.textContent = "RESET";
    mainContainer.appendChild(resetButton);

    let map = new GameBoard().getGameBoard();
    mainContainer.appendChild(map);
    resetButton.addEventListener("click", function () {
        resetMap(mainContainer);
        resetShips();
    });

    createShipsContainer(mainContainer);

}
function resetMap(mainContainer) {
    mainContainer.removeChild(document.querySelector(".game-board"));
    let map = new GameBoard().getGameBoard();
    mainContainer.appendChild(map);
    let container = document.querySelector("#shipsContainer");
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    container.remove();
    createShipsContainer(mainContainer);
}

function createShipsContainer(mainContainer) {
    let shipsContainer = document.createElement("div");
    shipsContainer.setAttribute("id", "shipsContainer");
    shipsContainer.textContent = "Your ships";
    mainContainer.appendChild(shipsContainer);
}


function resetShips() {

    [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].forEach(element => {
        let ship = new Ship(element);
        ship.resetShip();
    });
    document.getElementById("resetButton").setAttribute("disabled", true);
}