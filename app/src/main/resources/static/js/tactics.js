"use strict";
import { Ship } from "./ship.js";
import { GameBoard } from "./GameBoard.js";
import { Lobby } from "./Lobby.js";

export class tactics {
    constructor() {
        console.log("sie utworzyl");
    }

    showTactics() {
        let mainContainer = document.getElementById("main-container");
    
        let resetButton = document.createElement("button");
        resetButton.setAttribute("id", "resetButton");
        resetButton.setAttribute("disabled", "false");
        resetButton.textContent = "RESET";
    
        let saveButton = document.createElement("button");
        saveButton.setAttribute("id", "saveButton");
        saveButton.textContent = "SAVE";
    
        let localData = localStorage.getItem("map");
        let jsonArray = JSON.parse(localData);
    
        let gameboard = new GameBoard();
    
        let map = gameboard.getTacticGameBoard(jsonArray);
        
        mainContainer.appendChild(resetButton);
        mainContainer.appendChild(saveButton);
        mainContainer.appendChild(map);
    
        saveButton.addEventListener("click", function() {
            new Lobby().launch();
        });
    
        resetButton.addEventListener("click", function () {
            // $("#saveButton").attr("disabled", true);
            localStorage.clear();
            jsonArray = null;
            let newGameBoard = resetMap(gameboard, mainContainer, jsonArray);
            this.resetShips(newGameBoard);
        });
    
        this.createShipsContainer(mainContainer);
        if (!jsonArray) {
            this.resetShips(gameboard);
        };
    
    }
    resetMap(gameboard, mainContainer, jsonArray) {
        
        mainContainer.removeChild(document.querySelector(".game-board"));
    
        let newGameBoard = new GameBoard();
        let newMap = newGameBoard.getTacticGameBoard(jsonArray);
    
        mainContainer.appendChild(newMap);
    
        let container = document.querySelector("#shipsContainer");
        container.remove();
    
        this.createShipsContainer(mainContainer);
    
        return newGameBoard;
    }
    
    createShipsContainer(mainContainer) {
    
        let container = document.createElement("div");
        container.setAttribute("id", "myContainer");
    
        let shipsContainer = document.createElement("div");
        shipsContainer.setAttribute("id", "shipsContainer");
    
        let title = document.createElement("div");
        title.setAttribute("id", "header");
        title.textContent = "Your ships";
    
        shipsContainer.appendChild(title);
        
        mainContainer.appendChild(shipsContainer);
    }
    
    
    resetShips(map) {
    
        [1, 1, 1, 1, 2, 2, 2, 3, 3, 4].forEach(element => {
            let ship = new Ship(element, map);
            ship.resetShip();
        });
        document.getElementById("resetButton").setAttribute("disabled", true);
    }

}