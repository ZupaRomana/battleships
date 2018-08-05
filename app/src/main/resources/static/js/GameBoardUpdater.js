"use strict";

export class GameBoardUpdater {
    constructor(isHost = false) {
        this.postPlayerMapTimeouts = [];
        this.isHost = isHost;
        this.httpExec = new XMLHttpRequest();
    }

    postPlayerMapToServer() {
        console.log("Posting map!");
        let deleteTimeouts = () => {
            let gameRoom = JSON.parse(localStorage.getItem("gameRoom"));
            if (gameRoom) {
                if (this.isHost) {
                    if (gameRoom.isHostPostMap) {
                        while (this.postPlayerMapTimeouts.length > 0) {
                            clearTimeout(this.postPlayerMapTimeouts.pop());
                        }
                    }
                } else {
                    if (gameRoom.isPlayerPostMap) {
                        while (this.postPlayerMapTimeouts.length > 0) {
                            clearTimeout(this.postPlayerMapTimeouts.pop());
                        }
                    }
                }  
            }
        };

        this.httpExec.open("POST", "/gameBoardUpdater/playersTactics", true);
        this.httpExec.setRequestHeader("Content-Type", "application/json");
        this.httpExec.send(localStorage.getItem("map"));
        this.postPlayerMapTimeouts.push(setTimeout(() => { this.postPlayerMapToServer(); }, 5000));
        deleteTimeouts();
    }

    getEnemyMapFromServer() {
        console.log("Getting enemy map!");
        this.httpExec.onreadystatechange = () => {
            if (this.httpExec.status == 200 & this.httpExec.readyState == 4) {
                let json = this.httpExec.response;
                if (json) {
                    localStorage.setItem("enemyMap", json);
                } else {
                    console.log("Cannot load resources! " + json + " <- JSON")
                }
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater/playersTactics", true);
        this.httpExec.send(null);
    }

    postJSONToServer(json) {
        this.httpExec.open("POST", "/gameBoardUpdater", true);
        this.httpExec.setRequestHeader("Content-Type", "application/json");
        this.httpExec.send(json);
    }

    getJSONFromServerAndUpdateMap(actualGameBoards) {
        this.httpExec.onreadystatechange = () => {
            if (this.httpExec.readyState == 4 && this.httpExec.status == 200) {
                let json = this.httpExec.responseText;
                if (json) {
                    this.updatePlayerMap(json, actualGameBoards);
                }
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater", true);
        this.httpExec.send(null);
    }

    updatePlayerMap(json, actualGameBoards) {

        let receivedGameBoards = JSON.parse(json).gameBoards;
        let actualGameBoard = getActualPlayerGameBoard(actualGameBoards);
        let actualEnemyBoard = getActualEnemyBoard(actualGameBoards)
        let receivedGameBoard = getReceivedPlayerGameBoard(receivedGameBoards);

        changeTurn(actualEnemyBoard, receivedGameBoard);

        for (let i = 0; i < actualGameBoard.gameBoard.length; i++) {
            let actualSquare = actualGameBoard.gameBoard[i];
            let receivedSquare = receivedGameBoard.gameBoard[i];
            
            if (receivedSquare.xPos === actualSquare.xPos & receivedSquare.yPos === actualSquare.yPos) {
                checkAndChangeSquareState(receivedSquare, actualSquare);
                actualSquare.updateDivColor();
            }
        }
    }
}

function changeTurn(actualGameBoard, receivedGameBoard) {
    if (!receivedGameBoard.isPlayerMove) {
        actualGameBoard.isPlayerMove = true;
    } else {
        actualGameBoard.isPlayerMove = false;
    }
}

function getActualPlayerGameBoard(actualGameBoards) {
    for (let gameBoard of actualGameBoards) {
        if (gameBoard.isPlayer) {
            return gameBoard;
        }
    }
}

function getActualEnemyBoard(actualGameBoards) {
    for (let gameBoard of actualGameBoards) {
        if (!gameBoard.isPlayer) {
            return gameBoard;
        }
    }
}

function getReceivedPlayerGameBoard(receivedGameBoards) {
    for (let gameBoard of receivedGameBoards) {
        if (!gameBoard.isPlayer) {
            return gameBoard;
        }
    }
}

function checkAndChangeSquareState(receivedSquare, actualSquare) {
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