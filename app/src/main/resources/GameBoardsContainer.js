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
        this.container.addEventListener("click", () => {
            let json = this.gameBoardUpdater.parseGameBoardContainerToJSON(this);
            this.gameBoardUpdater.updatePlayerMap(json, this.gameBoards);
            this.gameBoardUpdater.getJSONFromServer();
        });
    }

    fillContaier() {
        for (let gameBoard of this.gameBoards) {
            this.container.appendChild(gameBoard.getGameBoard());
        }
    }

    scaleGameBoardToBrowserZoomLevel() {
        let browserZoomLevel = Math.round(window.devicePixelRatio * 100);
        window.setInterval(() => {
        let multipler = browserZoomLevel / 100;
        if (browserZoomLevel > 100) {
            this.container.style.width = `${100 / multipler}%`;
            this.container.style.height = `${100 / multipler}%`;
        } else {
            this.container.style.width = `${100}%`;
            this.container.style.height = `${100}%`;
        }
        GameBoard.setSizeOfGameBoards(this.gameBoards);
        });
    }
}