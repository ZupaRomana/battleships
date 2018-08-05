"use strict";

import { GameBoardsContainer } from "./GameBoardsContainer.js";
import { Lobby } from "./Lobby.js";

export class LoginPage {

    constructor(){};

    launch() {

        constructBody();
        handleSubmit();

        function handleSubmit() {
            const form = document.querySelector('#submits-container');
            form.addEventListener('submit', function(event){
                event.preventDefault();
                logIn();
            });
        };

    };
}

function constructBody() {

    const mainDiv = document.querySelector('#main-container');

    const contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'content-container');

    const header = document.createElement('header');
    header.innerHTML = 'Battleships v1.1';

    const form = document.createElement('form');
    form.setAttribute('id', 'submits-container');

    const input = document.createElement('input');
    input.setAttribute('id', 'nick-name')
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter your name');
    input.setAttribute('required', '');

    const br = document.createElement('br');

    const inputSubmit = document.createElement('input');
    inputSubmit.setAttribute('type', 'submit');
    inputSubmit.setAttribute('value', 'Start');

    mainDiv.appendChild(contentDiv);

    [header, form].forEach(element => {
        contentDiv.appendChild(element);
    });

    [input, br, inputSubmit].forEach(element => {
        form.appendChild(element);
    });

};

function logIn() {

    const nickName = document.querySelector('#nick-name').value;

    const request = new XMLHttpRequest();
    request.open("POST", "/index", true);
    const data = JSON.stringify({nickName});
    request.send(data);
    
    let lobby = new Lobby();
    lobby.launch();
};

// function lobby() {
//
//     let gameBoardsContainer = new GameBoardsContainer();
//     document.getElementById("main-container").appendChild(gameBoardsContainer.container);
//     gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
//        document.write(ileludzi);
//
//        const request = new XMLHttpRequest();
//            request.open("GET", "/index/test", true);
//            request.onreadystatechange = function() {
//
//                if (this.readyState == 4 && this.status == 200) {
//                    const json = this.responseText;
//                    var obj = JSON.parse(json);
//                    ileludzi = obj;
//                };
//            };
//
//         request.send();
//
//        setTimeout(() => { lobby();}, 1000);
// }