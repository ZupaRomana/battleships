"use strict";

import {tactics} from "./tactics.js";
var onlinePlayers = 0;

const INDEX_ROOM_ID = 1;
const INDEX_HOST_NAME = 2;
const INDEX_HOST_SESSION = 3;
const INDEX_CLIENT_NAME = 4;
const INDEX_CLIENT_SESSION = 5;

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
    lobbyHeaderYourTacticsButton.textContent = "Your tactics";

    lobbyHeaderYourTacticsButton.addEventListener("click", function() { 
        new tactics().showTactics()});
    lobbyHeader.appendChild(lobbyHeaderYourTacticsButton);

    const lobbyInfo = document.createElement('div');
    lobbyInfo.setAttribute('id', 'lobby-info');
    lobbyInfo.innerHTML = "Game rooms:";
    lobby.appendChild(lobbyInfo);

    const createNewRoomButton = document.createElement('div');
    createNewRoomButton.setAttribute('id', 'create-new-room');
    createNewRoomButton.innerHTML = "Create new room";
    createNewRoomButton.addEventListener('click', () => {
        sendPostCreateNewRoom();
        redirectToGameRoom();
    })
    lobby.appendChild(createNewRoomButton);

    const lobbyRoomsContainer = document.createElement('div');
    lobbyRoomsContainer.setAttribute('id', 'lobby-rooms-container');
    lobby.appendChild(lobbyRoomsContainer);

}

function sendPostCreateNewRoom() {

    if (localStorage.getItem("map") != null) {

    const request = new XMLHttpRequest();

    request.open("POST", "/index/createNewRoom", true);
    request.send();
    } else { window.alert("Set your tactics"); }
}

function redirectToGameRoom() {
    const request = new XMLHttpRequest();

    request.open("GET", "/gameBoardUpdater", true);
    request.send();
}

function fillRooms() {

     const request = new XMLHttpRequest();

     request.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            onlinePlayers = JSON.parse(this.responseText)[0];
            let array = JSON.parse(this.responseText)[1];

            let lobbyHeaderPlayersCount = document.querySelector('#counter');
            lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}`;

            buildRooms(array);
        };
    };
    request.open("GET", "/index/count", true);
    request.send();
    setTimeout(() => { fillRooms();}, 1000);
}

function buildRooms(array) {

    const roomsContainer = document.querySelector("#lobby-rooms-container");
    roomsContainer.innerHTML = "";

    if (array.length > 5) {
        let rooms = array.split("$");

        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].length > 5) {
                let room = rooms[i].split("#");

                let roomDiv = document.createElement("div");
                roomDiv.setAttribute("room-id", room[INDEX_ROOM_ID]);
                roomDiv.setAttribute("class", "room");

                let p1Div = document.createElement("div");
                p1Div.innerHTML = "P1: " + room[INDEX_HOST_NAME];
                roomDiv.appendChild(p1Div);

                let p2Div = document.createElement("div");
                p2Div.innerHTML = room[INDEX_CLIENT_NAME] == "null" ? "FREE" : "P1: " + room[INDEX_CLIENT_NAME];
                roomDiv.appendChild(p2Div);

                if (room[INDEX_CLIENT_NAME] == "null") {
                    let joinButton = document.createElement("button");
                    joinButton.setAttribute("id", "join-button");
                    joinButton.textContent = "JOIN";
                    joinButton.addEventListener('click', () => {
                        redirectToGameRoom();
                    })
                    roomDiv.appendChild(joinButton);
                }

                roomsContainer.appendChild(roomDiv);

            }

        }

    }
}