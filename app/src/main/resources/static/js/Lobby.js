"use strict";

var onlinePlayers = 0;

export class Lobby {
    constructor(){}

    launch() {
        constructBody();
        fillRooms();
    }
}

function constructBody() {

    const mainDiv = document.querySelector('#main-container');

    mainDiv.innerHTML = "";

    const lobby = document.createElement('div');
    lobby.setAttribute('id', 'lobby');
    mainDiv.appendChild(lobby);

    const lobbyHeader = document.createElement('div');
    lobbyHeader.setAttribute('id', 'lobby-header');
    lobby.appendChild(lobbyHeader);

    const lobbyHeaderPlayersCount = document.createElement('div');
    lobbyHeaderPlayersCount.setAttribute('id', 'counter');
    lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}`;
    lobbyHeader.appendChild(lobbyHeaderPlayersCount);

    const lobbyHeaderYourTacticsButton = document.createElement('button');
    lobbyHeaderYourTacticsButton.textContent = "Your tactics (nie dziala)";
    lobbyHeader.appendChild(lobbyHeaderYourTacticsButton);

    const lobbyInfo = document.createElement('div');
    lobbyInfo.setAttribute('id', 'lobby-info');
    lobbyInfo.innerHTML = "Game rooms:";
    lobby.appendChild(lobbyInfo);

    const lobbyRoomsContainer = document.createElement('div');
    lobbyRoomsContainer.setAttribute('id', 'lobby-rooms-container');
    lobby.appendChild(lobbyRoomsContainer);

//    const room2 = document.createElement('div');
//    room2.setAttribute('class', 'room');
//    lobbyRoomsContainer.appendChild(room2);
}

function fillRooms() {
    const roomsContainer = document.querySelector('#lobby-rooms-container');

    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            onlinePlayers = JSON.parse(this.responseText)[0];

            let lobbyHeaderPlayersCount = document.querySelector('#counter');
            lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}`;
        };
    };

    request.open("GET", "/index/count", true);
    request.send();

    setTimeout(() => { fillRooms();}, 1000);
}