"use strict";

export class LobbyStatusChecker {
    constructor() {
        this.httpExec = new XMLHttpRequest();
        this.hasRoomPlayers = false; 
        this.arePlayersReady = false;        
    }
    
    run() {
        this.checkIfPlayersAreInRoom();
        this.checkIfPlayersAreReady();
    }   

    checkIfPlayersAreInRoom() {
        getGameRoom(this.httpExec);
        checkIfGameRoom(this);   
    }
    
    checkIfPlayersAreReady() {
        if (this.gameRoom.hostIsReady & this.gameRoom.isPlayerReady) {
            this.arePlayersReady = true;
            console.log("Players are ready!");
            clearTimeout(playersAreReadyTimeout);
        }
        var playersAreReadyTimeout = setTimeout(() => { 
            this.checkIfPlayersAreReady();
        }, 2000);
    }
}

function getGameRoom(httpExec) {
    httpExec.onreadystatechange = () => {
        if (httpExec.status == 200 & httpExec.readyState == 4) {
            let json = httpExec.response;
            if (json) {
                localStorage.setItem("gameRoom", json);
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

function checkIfGameRoom(lobby) {
    let gameRoom = localStorage.getItem("gameRoom"),;
    if (gameRoom) {
        lobby.hasRoomPlayers = true;
        lobby.gameRoom = JSON.parse(gameRoom);
        console.log("Get game room!");
        clearTimeout(gameRoomTimeout);
    }
    var gameRoomTimeout = setTimeout(
        () => { 
            checkIfGameRoom(lobby);
    }, 1000);
}
