"use strict";
import { Ship } from "./ship.js";


showTactics();
function showTactics() {
    let mainContainer = document.createElement("div");
    document.body.appendChild(mainContainer);

    let resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.textContent = "RESET";
    mainContainer.appendChild(resetButton);
    resetButton.addEventListener("click", function() {resetShips()});

    // let map = createMap();
    // mainContainer.appendChild(map);

    let shipsContainer = document.createElement("div");
    shipsContainer.setAttribute("id", "shipsContainer");
    mainContainer.appendChild(shipsContainer);

}

function resetShips() {

    [1,1,1,1,2,2,2,3,3,4].forEach(element =>{
        let ship = new Ship(element);
        ship.resetShip();});
    document.getElementById("resetButton").setAttribute("disabled", true);
}