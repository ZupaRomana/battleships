"use strict";

import { startGame } from "./GameBoardsContainer.js";
import { LobbyStatusChecker } from "./LobbyStatusChecker.js";
import { GameBoardUpdater } from "./GameBoardUpdater.js";
import { tactics } from "./tactics.js";

var onlinePlayers = 0;

const INDEX_ROOM_ID = 1;
const INDEX_HOST_NAME = 2;
const INDEX_HOST_SESSION = 3;
const INDEX_CLIENT_NAME = 4;
const INDEX_CLIENT_SESSION = 5;

var isEnteredToRoom;

export class Lobby {
    constructor(){}

    launch() {
        this.setupLobby();
        constructBody(this);
        fillRooms(this);
    }

    setupLobby() {
        localStorage.removeItem("enemyMap");
        this.statusChecker = null;
    }
}

function constructBody(lobbyStatus) {

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
        document.getElementById("lobby").remove();
        new tactics().showTactics();
    });

    lobbyHeader.appendChild(lobbyHeaderYourTacticsButton);

    const lobbyInfo = document.createElement('div');
    lobbyInfo.setAttribute('id', 'lobby-info');
    lobbyInfo.innerHTML = "Game rooms:";
    lobby.appendChild(lobbyInfo);

    const createNewRoomButton = document.createElement('div');
    createNewRoomButton.setAttribute('id', 'create-new-room');
    createNewRoomButton.innerHTML = "Create new room";
    createNewRoomButton.addEventListener('click', () => {
        if (!isEnteredToRoom) {
            createNewRoom(lobbyStatus);
        } else {
            alert("You have already create a room or you have already join a room!");
        }
    })
    lobby.appendChild(createNewRoomButton);

    const lobbyRoomsContainer = document.createElement('div');
    lobbyRoomsContainer.setAttribute('id', 'lobby-rooms-container');
    lobby.appendChild(lobbyRoomsContainer);

}

function createNewRoom(lobby) {
    isEnteredToRoom = true;
    lobby.statusChecker = new LobbyStatusChecker(true);
    sendPostCreateNewRoom(lobby.statusChecker);
    let updater = new GameBoardUpdater(true);
    updater.postPlayerMapToServer();
}

function sendPostCreateNewRoom(statusChecker) {

    if (localStorage.getItem("map") != null) {
    
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            statusChecker.run();
        };
        request.open("POST", "/index/createNewRoom", true);
        request.send();

    } else { window.alert("Set your tactics"); }
}

function enterARoom(roomId) {
    const request = new XMLHttpRequest();
    request.open("POST", "/index/enterARoom", true);
    request.send(roomId);
}

function fillRooms(lobby) {

     const request = new XMLHttpRequest();

     request.onreadystatechange = () => {

        if (request.readyState == 4 && request.status == 200) {
            onlinePlayers = JSON.parse(request.responseText)[0];
            let array = JSON.parse(request.responseText)[1];

            let lobbyHeaderPlayersCount = document.querySelector('#counter');
            lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}`;

            if (lobby.statusChecker) {
                if (lobby.statusChecker.hasRoomPlayers) {
                    let statusChecker = lobby.statusChecker;
                    let gameRoom = statusChecker.gameRoom;
                    let playerName = gameRoom.playerName; 

                    let isPlayerReady = (isReady) => {
                        return isReady ? "Ready!": "Not ready!"
                    };
                    lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}` +
                    `<br>${gameRoom.hostName}: ${isPlayerReady(statusChecker.isFirstPlayerReady)}
                    <br>${playerName ? playerName: "Waiting for player!"}: ${isPlayerReady(statusChecker.isSecondPlayerReady)}`;
                    lobbyHeaderPlayersCount.style.fontSize = "20px";
                }
            }

            buildRooms(array, lobbyTimeOut, lobby);
        };
    };
    request.open("GET", "/index/count", true);
    request.send();
    var lobbyTimeOut = setTimeout(() => { fillRooms(lobby); }, 1000);
}

function buildRooms(array, lobbyTimeOut, lobby) {
   
    const roomsContainer = document.querySelector("#lobby-rooms-container");
    roomsContainer.innerHTML = "";

    if (array.length > 5) {
        let rooms = array.split("$");

        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].length > 5) {
            
                let room = rooms[i].split("#");

                let roomDiv = document.createElement("div");
                let roomId = room[INDEX_ROOM_ID];
                roomDiv.setAttribute("room-id", room[INDEX_ROOM_ID]);
                roomDiv.setAttribute("class", "room");

                let p1Div = document.createElement("div");
                p1Div.innerHTML = "P1: " + room[INDEX_HOST_NAME];
                roomDiv.appendChild(p1Div);

                let p2Div = document.createElement("div");
                p2Div.innerHTML = room[INDEX_CLIENT_NAME] == "null" ? "FREE" : "P2: " + room[INDEX_CLIENT_NAME];
                roomDiv.appendChild(p2Div);
                if (lobby.statusChecker) {
                    roomDiv.setAttribute("disabled", lobby.statusChecker.arePlayersReady ? "false": "true");
                }

                if (room[INDEX_CLIENT_NAME] == "null" && !lobby.statusChecker) {
                    let joinButton = document.createElement("button");
                    joinButton.setAttribute("id", "join-button");
                    joinButton.textContent = "JOIN";
                    joinButton.addEventListener('click', () => {
                        if (!isEnteredToRoom) {
                            isEnteredToRoom = true;
                            enterARoom(roomId);
                            lobby.statusChecker = new LobbyStatusChecker(false);
                            lobby.statusChecker.run();
                            let updater = new GameBoardUpdater(false);
                            updater.postPlayerMapToServer();
                        } else {
                            alert("You have already join a room!");
                        }
                    });
                    roomDiv.appendChild(joinButton);
                } else {
                    roomDiv.addEventListener("click", () => {
                        if (lobby.statusChecker.arePlayersReady) {
                            clearTimeout(lobbyTimeOut);
                            startGame(lobby.statusChecker.isHost);
                        } else {
                            alert("Players are not ready!");
                        }
                    });
                }
                roomsContainer.appendChild(roomDiv);
            }
        }
    }
}