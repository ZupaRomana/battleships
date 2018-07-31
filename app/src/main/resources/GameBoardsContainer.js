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
            let container = this.gameBoardUpdater.parseJSONToGameObject(json);
            let serverGameBoards = container.gameBoards;
            let currentDevicePlayer = () => {
                for (let gameBoard of this.gameBoards) {
                    if (gameBoard.isPlayer) {
                        return gameBoard;
                    }
                }
            };
            for (let gameBoard of serverGameBoards) {
                if (!gameBoard.isPlayer) {
                    let current = currentDevicePlayer();
                    for (let i = 0; i < gameBoard.gameBoard.length; i++) {
                        let serverSquare = gameBoard.gameBoard[i];
                        let currentSquare = current.gameBoard[i];
                        if (serverSquare.xPos === currentSquare.xPos & serverSquare.yPos === currentSquare.yPos) {
                            if (serverSquare.isHit !== currentSquare.isHit) {
                                currentSquare.isHit = serverSquare.isHit;
                            } else if (serverSquare.isMiss !== currentSquare.isMiss) {
                                currentSquare.isMiss = serverSquare.isMiss;
                            } else if (serverSquare.isShip !== currentSquare.isShip) {
                                currentSquare.isShip = serverSquare.isShip;
                            }
                            currentSquare.updateDivColor();
                        }
                    }
                }
            }
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