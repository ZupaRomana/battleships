"use strict";

export class LobbyStatusChecker {
    constructor() {
        this.httpExec = new XMLHttpRequest();
        this.hasRoomPlayers = false;         
    }
    
    run() {
        this.checkIfPlayersAreInRoom();
    }   

    checkIfPlayersAreInRoom() {
        getGameRoom(this.httpExec)
        
    }   
}

function getGameRoom(httpExec) {
    httpExec.onreadystatechange = () => {
        if (httpExec.status == 200 & httpExec.readyState == 4) {
            localStorage.setItem("gameRoom", httpExec.responeText);
            clearTimeout(getGameRoom)
            console.log("Get game room!");
        }
    };
    httpExec.open("GET", "/lobbyController", true);
    httpExec.send(null);
    var getRoomTimeout = setTimeout(() => { getGameRoom(httpExec); }, 1000)
}
