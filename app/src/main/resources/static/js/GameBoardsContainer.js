"use strict";

import { GameBoard } from "./GameBoard.js";
import { GameBoardUpdater } from "./GameBoardUpdater.js";

export class GameBoardsContainer {
    constructor(isHost) {
        this.isHost = isHost;
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
            if (this.isHost & !gameBoard.isPlayer) {
                gameBoard.isPlayerMove = true;
            } else {
                gameBoard.isPlayerMove = false;
            }
        }
    }

    scaleGameBoardToBrowserZoomLevelAndUpdateMap() {
        window.setInterval(() => {
            this.gameBoardUpdater.getJSONFromServerAndUpdateMap(this.gameBoards);
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
        }, 1000);
    }
}

export function startGame(isHost) {    
        let gameBoardsContainer = new GameBoardsContainer(isHost);
        document.getElementById("main-container").appendChild(gameBoardsContainer.container);
        gameBoardsContainer.scaleGameBoardToBrowserZoomLevelAndUpdateMap();
        document.getElementById("lobby").remove();
    }