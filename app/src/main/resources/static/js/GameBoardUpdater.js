"use strict";

export class GameBoardUpdater {
    constructor() {
    }

    parseGameBoardContainerToJSON(gameBoardContainer) {
        return JSON.stringify(gameBoardContainer);
    }

    postJSONToServer(json) {
        let httpExec = new XMLHttpRequest();
        httpExec.onreadystatechange = () => {
            // sprawdz w questorze czym to sie rozni 
            console.log(`Http: ${httpExec.responseText} This: ${this.responseText}`);
        };
        httpExec.open("POST", "/gameBoardUpdater", true);
        httpExec.send(json);
    }

    getJSONFromServer() {
        let httpExec = new XMLHttpRequest();
        httpExec.onreadystatechange = () => {
            // sprawdz w questorze czym to sie rozni 
            console.log(`Http: ${httpExec.responseText} This: ${this.responseText}`);
        };
        httpExec.open("GET", "/gameBoardUpdater", true);
        httpExec.send();
    }

    parseJSONToObject(json) { 
        return JSON.parse(json);
    }

    updatePlayerMap(json, actualGameBoards) {
        let receivedGameBoards = this.parseJSONToObject(json).gameBoards;
        let actualGameBoard = this.getActualPlayerGameBoard(actualGameBoards);
        let receivedGameBoard = this.getReceivedPlayerGameBoard(receivedGameBoards);

        for (let i = 0; i < actualGameBoard.gameBoard.length; i++) {
            let actualSquare = actualGameBoard.gameBoard[i];
            let receivedSquare = receivedGameBoard.gameBoard[i];

            if (receivedSquare.xPos === actualSquare.xPos & receivedSquare.yPos === actualSquare.yPos) {
                this.checkAndChangeSquareState(receivedSquare, actualSquare);
                actualSquare.updateDivColor();
            }
        }
    }
    
    getActualPlayerGameBoard(actualGameBoards) {
        for (let gameBoard of actualGameBoards) {
            if (gameBoard.isPlayer) {
                return gameBoard;
            }
        }
    }

    getReceivedPlayerGameBoard(receivedGameBoards) {
        for (let gameBoard of receivedGameBoards) {
            if (!gameBoard.isPlayer) {
                return gameBoard;
            }
        }
    }

    checkAndChangeSquareState(receivedSquare, actualSquare) {
        if (receivedSquare.isHit !== actualSquare.isHit) {
            actualSquare.isHit = receivedSquare.isHit;
        } else if (receivedSquare.isMiss !== actualSquare.isMiss) {
            actualSquare.isMiss = receivedSquare.isMiss;
        } else if (receivedSquare.isShip !== actualSquare.isShip) {
            actualSquare.isShip = receivedSquare.isShip;
        }
    }
}