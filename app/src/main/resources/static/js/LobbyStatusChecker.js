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
        console.log(this.httpExec);
        getGameRoom(this.httpExec)
        
    }   
}

function getGameRoom(httpExec) {
    httpExec.onreadystatechange = () => {
        if (httpExec.status == 200 & httpExec.readyState == 4) {
            let json = httpExec.response;
            if (json) {
                localStorage.setItem("gameRoom", json);
                clearTimeout(getRoomTimeout);
                console.log("Get game room!");
            } else {
                console.log("Bad game room download from server!")
            }
        }
    };
    httpExec.open("GET", "/lobbyController", true);
    httpExec.send();
    var getRoomTimeout = setTimeout(() => { getGameRoom(httpExec); }, 2000);
}
