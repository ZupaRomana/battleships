"use strict";

import { GameBoard } from "./GameBoard.js";

export class GameBoardsContainer {
    constructor() {
        this.gameBoards = [new GameBoard(), new GameBoard()];
        this.loadAndFillContainer();
    }

    loadAndFillContainer() {
        this.container = document.createElement("div");
        this.container.setAttribute("class", "game-boards-container");
        this.fillContaier();
    }

    fillContaier() {
        this.container.appendChild(this.gameBoards[0].getEnemyGameBoard());
        this.container.appendChild(this.gameBoards[1].getPlayerGameBoard());
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