"use strict";

import { GameBoard } from "./GameBoard.js";
import { GameBoardUpdater } from "./GameBoardUpdater.js";

export class GameBoardsContainer {
    constructor() {
        this.gameBoardUpdater = new GameBoardUpdater();
        this.gameBoards = [new GameBoard(false), new GameBoard()];
        this.loadAndFillContainer();
    }

    loadAndFillContainer() {
        this.container = document.createElement("div");
        this.container.setAttribute("class", "game-boards-container");
        this.fillContaier();
    }

    fillContaier() {
        for (let gameBoard of this.gameBoards) {
            this.container.appendChild(gameBoard.getGameBoard(this.gameBoardUpdater, this));
        }
    }

    scaleGameBoardToBrowserZoomLevel() {
        let updateMap = () => {
            try { 
                if (!this.gameBoardUpdater.isBeginOfGame) {
                    this.gameBoardUpdater.getJSONFromServerAndUpdateMap(this.gameBoards);
                } else {
                    this.gameBoardUpdater.isBeginOfGame = true;
                }
            } catch(err) {
                console.log(err.message);
            }
        };

        window.setInterval(() => {
            updateMap()
            let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
            let multipler = browserZoomLevel / 100;
            if (browserZoomLevel > 100) {
                this.container.style.width = `${100 / multipler}%`;
                this.container.style.height = `${100 / multipler}%`;
            } else {
                this.container.style.width = `${100}%`;
                this.container.style.height = `${100}%`;
            }
            GameBoard.setSizeOfGameBoards(this.gameBoards);
        }, 3000);
    }
}

export let startGameBoard = function(gameBoardUpdater, redirectInterval) {

        if (redirectInterval) {
            clearInterval(redirectInterval);
        }

        let interval = setInterval(() => {
            console.log("gameBoard interval");
            gameBoardUpdater.getJSONFromServerInitial();
         }, 2000);

        if (localStorage.getItem("enemyMap")) {
            clearInterval(interval);
            gameBoardUpdater.postJSONToServer(localStorage.getItem("map"), true);
            let gameBoardsContainer = new GameBoardsContainer();
            document.getElementById("main-container").appendChild(gameBoardsContainer.container);
            gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
            document.getElementById("lobby").remove();
        } else {
            console.log("reasources not loaded");
        }
    }