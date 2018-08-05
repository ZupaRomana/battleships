import { GameBoardUpdater } from "./GameBoardUpdater.js";
import { isHost } from "./Lobby.js";

"use strict";

var hasGameRoomPlayersTimeouts = [];
export class LobbyStatusChecker {
    constructor(isHost) {
        localStorage.removeItem("gameRoom");
        this.updateGameRoomTimeout = [];
        this.arePlayersReadyTimeouts = [];
        this.httpExec = new XMLHttpRequest();
        this.isHost = isHost;
        this.hasRoomPlayers = false; 
        this.arePlayersReady = false;
        this.isFirstPlayerReady = false;
        this.isSecondPlayerReady = false;       
    }
    
    run() {
        this.checkIfPlayersAreInRoom();
        this.checkIfPlayersAreReady();
        this.updateGameRoomStatus();
    }   

    checkIfPlayersAreInRoom() {
        getGameRoom(this.httpExec);
        checkIfGameRoomHasPlayers(this);
        clearHasRoomPlayersTimeout(this.hasRoomPlayers);
    }
    
    checkIfPlayersAreReady() {
        if (this.gameRoom) {
            if (this.gameRoom.isHostPostMap & this.gameRoom.isPlayerPostMap) {
                let updater = new GameBoardUpdater(isHost);
                let json = localStorage.getItem("enemyMap");
                if (json) {
                    if (this.isHost) {
                        this.isFirstPlayerReady = true;
                        if (this.gameRoom.arePlayersReady) {
                            this.isSecondPlayerReady = true;
                            this.arePlayersReady = this.gameRoom.arePlayersReady;
                        }
                    } else {
                        this.isSecondPlayerReady = true;
                        if (this.gameRoom.arePlayersReady) {
                            this.isFirstPlayerReady = true;
                            this.arePlayersReady = this.gameRoom.arePlayersReady;
                        }
                    }
                    console.log("Players are ready!" + " Time out: " + playersAreReadyTimeout + " Is host: " + isHost);
                    clearTimeout(playersAreReadyTimeout);
                } else {
                    updater.getEnemyMapFromServer();    
                }
            }
        }
        var playersAreReadyTimeout = setTimeout(() => { 
            this.checkIfPlayersAreReady();
        }, 2000);
        this.arePlayersReadyTimeouts.push(playersAreReadyTimeout);
        clearUpdateTimeouts(this.gameRoom, this.arePlayersReadyTimeouts);
    }

    updateGameRoomStatus() {
        getGameRoom(this.httpExec);
        let json = localStorage.getItem("gameRoom");
        if (json) {
            this.gameRoom = JSON.parse(json);
        }
        let updateRoomTimeout = setTimeout(() => { this.updateGameRoomStatus(); }, 5000);
        this.updateGameRoomTimeout.push(updateRoomTimeout);
        clearUpdateTimeouts(this.gameRoom, this.updateGameRoomTimeout);
    }
}

function getGameRoom(httpExec) {
    httpExec.onreadystatechange = () => {
        if (httpExec.status == 200 & httpExec.readyState == 4) {
            let json = httpExec.response;
            if (json) {
                localStorage.setItem("gameRoom", json);
                console.log("Downloaded game room!"  + " Time out: " + getRoomTimeout);
                clearTimeout(getRoomTimeout);
            } else {
                console.log("Bad game room download from server!");
            }
        }
    };
    httpExec.open("GET", "/lobbyController", true);
    httpExec.send();
    var getRoomTimeout = setTimeout(() => { getGameRoom(httpExec); }, 2000);
}


function checkIfGameRoomHasPlayers(lobby) {    
    let gameRoom = JSON.parse(localStorage.getItem("gameRoom"));
    if (gameRoom) {
        if (gameRoom.hasPlayers) {
            lobby.hasRoomPlayers = true;
            lobby.gameRoom = gameRoom;
            console.log("Game room has players!");
        }
    }

    let gameRoomTimeout = setTimeout(
        () => { 
            checkIfGameRoomHasPlayers(lobby);
    }, 1000);

    hasGameRoomPlayersTimeouts.push(gameRoomTimeout);
    clearHasRoomPlayersTimeout(lobby.hasRoomPlayers);
}

function clearHasRoomPlayersTimeout(hasPlayers) {
    if (hasPlayers) {
        for (let timeout of hasGameRoomPlayersTimeouts) {
            clearTimeout(timeout);
        }
    }
}

function clearUpdateTimeouts(gameRoom, timeouts) {
    if (gameRoom) {
        if (gameRoom.arePlayersReady) {
            while (timeouts.length > 0) {
                clearTimeout(timeouts.pop());
            }
        }
    }
}
