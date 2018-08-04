"use strict";

var hasGameRoomPlayersTimeouts = [];
export class LobbyStatusChecker {
    constructor() {
        this.updateGameRoomTimeout = [];
        this.httpExec = new XMLHttpRequest();
        this.hasRoomPlayers = false; 
        this.arePlayersReady = false;        
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
            if (this.gameRoom.isHostReady & this.gameRoom.isPlayerReady) {
                this.arePlayersReady = true;
                console.log("Players are ready!" + " Time out: " + playersAreReadyTimeout);
                clearTimeout(playersAreReadyTimeout)
            }
        }
        var playersAreReadyTimeout = setTimeout(() => { 
            this.checkIfPlayersAreReady();
        }, 2000);
    }

    updateGameRoomStatus() {
        getGameRoom(this.httpExec);
        let json = localStorage.getItem("gameRoom");
        if (json) {
            this.gameRoom = JSON.parse(json);
            if (this.gameRoom.arePlayersReady) {
                for (let timeout of this.updateGameRoomTimeout) {
                    clearTimeout(timeout);
                }
            }
        }
        this.updateGameRoomTimeout.push(setTimeout(() => { this.updateGameRoomStatus(); }, 5000));
    }
}

function getGameRoom(httpExec) {
    httpExec.onreadystatechange = () => {
        if (httpExec.status == 200 & httpExec.readyState == 4) {
            let json = httpExec.response;
            if (json) {
                localStorage.setItem("gameRoom", json);
                console.log("Downloaded game room!"  + " Time out: " + getRoomTimeout)
                clearTimeout(getRoomTimeout);
            } else {
                console.log("Bad game room download from server!")
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
            console.log("Game room has players!"  + " Time out: " + gameRoomTimeout);
            clearTimeout(gameRoomTimeout);
            clearHasRoomPlayersTimeout(lobby.hasPlayers)
        }
    }
    var gameRoomTimeout = setTimeout(
        () => { 
            checkIfGameRoomHasPlayers(lobby);
    }, 1000);
    hasGameRoomPlayersTimeouts.push(gameRoomTimeout);
}

function clearHasRoomPlayersTimeout(hasPlayers) {
    if (hasPlayers) {
        for (let timeout of hasGameRoomPlayersTimeouts) {
            clearTimeout(timeout);
        }
    }
}
