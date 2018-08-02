"use strict";

export class GameBoardUpdater {
    constructor() {
        this.httpExec = new XMLHttpRequest(); 
    }

    parseGameBoardContainerToJSON(gameBoardContainer) {
        return JSON.stringify(gameBoardContainer);
    }

    postJSONToServer(json, isBeginOfGame = false) {
        if (!isBeginOfGame) {
            this.httpExec.open("POST", "/gameBoardUpdater", true);
            this.httpExec.setRequestHeader("Content-Type", "application/json");
            this.httpExec.send(json);
            console.log(json + "JSON postJSONToServer() normal");
        } else {
            console.log(json + " JSON postJSONToServer() in else");
            this.httpExec.open("POST", "/gameBoardUpdater?isInit=true", true);
            this.httpExec.setRequestHeader("Content-Type", "application/json");
            this.httpExec.send(json);
        }
    }

    getJSONFromServerInitial() {
        let json;
        this.httpExec.onreadystatechange = () => {
            if (this.httpExec.readyState == 4 && this.httpExec.status == 200) {
                json = this.httpExec.responseText;
                if (json) {
                    localStorage.setItem("enemyMap", json);
                } else {
                    console.log("cannot load resources");
                }
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater", false);
        this.httpExec.send(null);
    }

    getJSONFromServerAndUpdateMap(actualGameBoards) {
        this.httpExec.onreadystatechange = () => {
            if (this.httpExec.readyState == 4 && this.httpExec.status == 200) {
                this.updatePlayerMap(this.httpExec.responseText, actualGameBoards);
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater", true);
        this.httpExec.send(null);
        console.log(this.httpExec.responseText + " respone text");
    }

    updatePlayerMap(json, actualGameBoards) {
        let receivedGameBoards = JSON.parse(json).gameBoards;
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
        } 
        if (receivedSquare.isMiss !== actualSquare.isMiss) {
            actualSquare.isMiss = receivedSquare.isMiss;
        }
        if (receivedSquare.isShip !== actualSquare.isShip) {
            actualSquare.isShip = receivedSquare.isShip;
        }
    }
}