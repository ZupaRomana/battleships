"use strict";

import { startGameBoard } from "./GameBoardsContainer.js";
import { LobbyStatusChecker } from "./LobbyStatusChecker.js";
import { GameBoardUpdater } from "./GameBoardUpdater.js";
import { tactics } from "./tactics.js";

var onlinePlayers = 0;

const INDEX_ROOM_ID = 1;
const INDEX_HOST_NAME = 2;
const INDEX_HOST_SESSION = 3;
const INDEX_CLIENT_NAME = 4;
const INDEX_CLIENT_SESSION = 5;
var hostname;
var isPlayerSendMapToServer = false;
export var isHost;
export class Lobby {
    constructor(){}

    launch() {
        this.setupLobby();
        constructBody(this.gameBoardUpdater, this.statusChecker);
        fillRooms(this.gameBoardUpdater, this.statusChecker);
    }

    setupLobby() {
        localStorage.removeItem("enemyMap");
        localStorage.removeItem("gameRoom");
        this.statusChecker = new LobbyStatusChecker();
        this.gameBoardUpdater = new GameBoardUpdater();
    }
}

function constructBody(gameBoardUpdater, statusChecker) {

    

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
        sendPostCreateNewRoom(statusChecker);
        isHost = true;
        let updater = new GameBoardUpdater(isHost);
        updater.postPlayerMapToServer();
    })
    lobby.appendChild(createNewRoomButton);

    const lobbyRoomsContainer = document.createElement('div');
    lobbyRoomsContainer.setAttribute('id', 'lobby-rooms-container');
    lobby.appendChild(lobbyRoomsContainer);

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

function redirectToGameRoom(gameBoardUpdater, isSelect) {
    
    if (isSelect) {
        var redirectInternal = setInterval(() => {
            gameBoardUpdater.postJSONToServer(localStorage.getItem("map"), true);
        }, 1000);
    }

    startGameBoard(gameBoardUpdater, redirectInternal);
}


function enterARoom() {
    const request = new XMLHttpRequest();
    request.open("POST", "/index/enterARoom", true);
    request.send(hostname);
}

function fillRooms(gameBoardUpdater, statusChecker) {

     const request = new XMLHttpRequest();

     request.onreadystatechange = () => {

        if (request.readyState == 4 && request.status == 200) {
            onlinePlayers = JSON.parse(request.responseText)[0];
            let array = JSON.parse(request.responseText)[1];

            let lobbyHeaderPlayersCount = document.querySelector('#counter');
            lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}`;
            if (statusChecker.hasRoomPlayers) {
                let gameRoom = statusChecker.gameRoom;;
                let playerName = gameRoom.playerName; 

                let isPlayerReady = (isReady) => {
                    return isReady ? "Ready!": "Not ready!"
                };
                lobbyHeaderPlayersCount.innerHTML = `Players online: ${onlinePlayers}` +
                 `<br>${gameRoom.hostName}: ${isPlayerReady(statusChecker.isFirstPlayerReady)}
                 <br>${playerName ? playerName: "Waiting for player!"}: ${isPlayerReady(statusChecker.isSecondPlayerReady)}`;
                 lobbyHeaderPlayersCount.style.fontSize = "20px";
            }

            buildRooms(array, gameBoardUpdater, lobbyTimeOut, statusChecker);
        };
    };
    request.open("GET", "/index/count", true);
    request.send();
    var lobbyTimeOut = setTimeout(() => { fillRooms(gameBoardUpdater, statusChecker); }, 1000);
}

function buildRooms(array, gameBoardUpdater, lobbyTimeOut, statusChecker) {
   
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
                hostname = room[INDEX_HOST_NAME];
                roomDiv.appendChild(p1Div);

                let p2Div = document.createElement("div");
                p2Div.innerHTML = room[INDEX_CLIENT_NAME] == "null" ? "FREE" : "P2: " + room[INDEX_CLIENT_NAME];
                roomDiv.appendChild(p2Div);
                roomDiv.setAttribute("disabled", statusChecker.arePlayersReady ? "false": "true");

                if (room[INDEX_CLIENT_NAME] == "null" && !isHost) {
                    let joinButton = document.createElement("button");
                    joinButton.setAttribute("id", "join-button");
                    joinButton.textContent = "JOIN";
                    joinButton.addEventListener('click', () => {
                        enterARoom()
                        statusChecker.run();
                        isHost = false;
                        let updater = new GameBoardUpdater(isHost);
                        updater.postPlayerMapToServer();
                        //updater.postPlayerMapToServer(localStorage.getItem("map"));
                        /*gameBoardUpdater.getJSONFromServerInitial();
                        gameBoardUpdater.postJSONToServer(localStorage.getItem("map"), true);
                        isPlayerSendMapToServer = true;*/

                    });
                    roomDiv.appendChild(joinButton);
                } else {
                    roomDiv.addEventListener("click", () => {
                        if (!isPlayerSendMapToServer) {
                            clearTimeout(lobbyTimeOut);
                            redirectToGameRoom(gameBoardUpdater, true);
                            
                        } else {
                            clearTimeout(lobbyTimeOut);
                            gameBoardUpdater.getJSONFromServerInitial();
                            startGameBoard(gameBoardUpdater);
                        }
                    });
                }


                roomsContainer.appendChild(roomDiv);

            }

        }

    }
}