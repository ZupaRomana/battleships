"use strict";
import { Ship } from "./ship.js";
import { GameBoard } from "./GameBoard.js";
import { Lobby } from "./Lobby.js";

export class tactics {

    constructor() {
        this.showTactics = function() { 
            
        let mainContainer = document.getElementById("main-container");
        mainContainer.innerHTML = "";

        let resetButton = document.createElement("button");
        resetButton.setAttribute("id", "resetButton");
        resetButton.textContent = "RESET";

        let saveButton = document.createElement("button");
        saveButton.setAttribute("id", "saveButton");
        saveButton.textContent = "SAVE";

        let contextContainer = document.createElement("div");
        contextContainer.setAttribute("id", "contextContainer");

        let localData = localStorage.getItem("map");
        let jsonArray = JSON.parse(localData);

        let gameboard = new GameBoard();

        let map = gameboard.getPlayerGameBoard(jsonArray);

        mainContainer.appendChild(resetButton);
        mainContainer.appendChild(saveButton);
        contextContainer.appendChild(map);
        mainContainer.appendChild(contextContainer);

        saveButton.addEventListener("click", function () {
            new Lobby().launch();
        });

        resetButton.addEventListener("click", function () {
            $("#saveButton").attr("disabled", true);
            localStorage.clear();
            jsonArray = null;
            let newGameBoard = new tactics().resetMap(gameboard, contextContainer, jsonArray);
            new tactics().resetShips(newGameBoard);
        });

        this.createShipsContainer(contextContainer); 
        
        
        if(localStorage.getItem("map") == null) {
            this.resetShips(gameboard);
        }
    };
    }

    resetMap(gameboard, contextContainer, jsonArray) {

        contextContainer.removeChild(document.querySelector(".game-board"));

        let newGameBoard = new GameBoard();
        let newMap = newGameBoard.getPlayerGameBoard(jsonArray);

        contextContainer.appendChild(newMap);

        let container = document.querySelector("#shipsContainer");
        container.remove();

        this.createShipsContainer(contextContainer);

        return newGameBoard;
    }

    createShipsContainer(contextContainer) {

        let shipsContainer = document.createElement("div");
        shipsContainer.setAttribute("id", "shipsContainer");

        shipsContainer.textContent = "Your ships";

        contextContainer.appendChild(shipsContainer);
    }


    resetShips(map) {

        let ships = [];
        [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].forEach(element => {
            let ship = new Ship(element, map);
            ships.push(ship);
            ship.resetShip(ships);
        });
        document.getElementById("resetButton").setAttribute("disabled", true);
    }
}