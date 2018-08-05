"use strict";

export class GameBoardUpdater {
    constructor(isHost = false) {
        this.postPlayerMapTimeouts = [];
        this.isHost = isHost;
        this.httpExec = new XMLHttpRequest();
        this.isBeginOfGame = true;
    }

    parseGameBoardContainerToJSON(gameBoardContainer) {
        return JSON.stringify(gameBoardContainer);
    }

    postPlayerMapToServer() {
        console.log("Posting map!");
        let deleteTimeouts = () => {
            let gameRoom = JSON.parse(localStorage.getItem("gameRoom"));
            if (gameRoom) {
                if (this.isHost) {
                    if (gameRoom.isHostReady) {
                        while (this.postPlayerMapTimeouts > 0) {
                            clearTimeout(this.postPlayerMapTimeouts.pop());
                        }
                    }
                } else {
                    if (gameRoom.isPlayerReady) {
                        while (this.postPlayerMapTimeouts > 0) {
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

    postJSONToServer(json, isBeginOfGame = false) {
        if (!isBeginOfGame) {
            this.httpExec.open("POST", "/gameBoardUpdater", true);
            this.httpExec.setRequestHeader("Content-Type", "application/json");
            this.httpExec.send(json);
        } else {
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
                    console.log("cannot load resources! " + json + " <- JSON");
                }
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater", true);
        this.httpExec.send(null);
    }

    getJSONFromServerAndUpdateMap(actualGameBoards) {
        this.isBeginOfGame = false;
        this.httpExec.onreadystatechange = () => {
            if (this.httpExec.readyState == 4 && this.httpExec.status == 200) {
                this.updatePlayerMap(this.httpExec.responseText, actualGameBoards);
            }
        };
        this.httpExec.open("GET", "/gameBoardUpdater", false);
        this.httpExec.send(null);
    }

    updatePlayerMap(json, actualGameBoards) {

        let receivedGameBoards = JSON.parse(json).gameBoards;
        let actualGameBoard = this.getActualPlayerGameBoard(actualGameBoards);
        let actualEnemyBoard = this.getActualEnemyBoard(actualGameBoards)
        let receivedGameBoard = this.getReceivedPlayerGameBoard(receivedGameBoards);

        this.changeTurn(actualEnemyBoard, receivedGameBoard, JSON.parse(json).gameBoardUpdater);

        for (let i = 0; i < actualGameBoard.gameBoard.length; i++) {
            let actualSquare = actualGameBoard.gameBoard[i];
            let receivedSquare = receivedGameBoard.gameBoard[i];
            
            if (receivedSquare.xPos === actualSquare.xPos & receivedSquare.yPos === actualSquare.yPos) {
                this.checkAndChangeSquareState(receivedSquare, actualSquare);
                actualSquare.updateDivColor();
            }
        }
    }

    changeTurn(actualGameBoard, receivedGameBoard, receivedUpdater) {
        if (!receivedGameBoard.isPlayerMove) {
            actualGameBoard.isPlayerMove = true;
        } else {
            actualGameBoard.isPlayerMove = false;
        }
    }
    
    getActualPlayerGameBoard(actualGameBoards) {
        for (let gameBoard of actualGameBoards) {
            if (gameBoard.isPlayer) {
                return gameBoard;
            }
        }
    }

    getActualEnemyBoard(actualGameBoards) {
        for (let gameBoard of actualGameBoards) {
            if (!gameBoard.isPlayer) {
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