"use strict";

//import { gameBoard } from "./main.js";

export class Welcome {
    constructor(){};
    run() {

    let mainDiv = document.querySelector('#main-container');

    let contentDiv = document.createElement('div');
    contentDiv.setAttribute('id', 'content-container');

    let header = document.createElement('header');
    header.innerHTML = 'Battleships v1.1';

    let form = document.createElement('form');
    form.setAttribute('id', 'submits-container');
    form.addEventListener(`submit`, () => sendPost(document.querySelector('#nick-name').value));

    let input = document.createElement('input');
    input.setAttribute('id', 'nick-name')
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter your name');
    input.setAttribute('required', '');

    let br = document.createElement('br');

    let inputSubmit = document.createElement('input');
    inputSubmit.setAttribute('type', 'submit');
    inputSubmit.setAttribute('value', 'Start');

    mainDiv.appendChild(contentDiv);

    [header, form].forEach(element => {
        contentDiv.appendChild(element);
    });

    [input, br, inputSubmit].forEach(element => {
        form.appendChild(element);
    })

    const sendPost = function(nickName) {
        const request = new XMLHttpRequest();
        request.open("POST", "/index", true);
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let json = this.responseText;
                var obj = JSON.parse(json);
                lobby();
            };
        };
        const data = JSON.stringify({nickName});
        request.send(data);
    }
    var ileludzi = 5;
    function lobby() {

        gameBoard();

//        document.write(ileludzi);
//
//        const request = new XMLHttpRequest();
//            request.open("GET", "/index/dupa", true);
//            request.onreadystatechange = function() {
//
//                if (this.readyState == 4 && this.status == 200) {
//                    let json = this.responseText;
//                    var obj = JSON.parse(json);
//                    ileludzi = obj;
//                };
//            };
//
//         request.send();
//
//        setTimeout(() => { lobby();}, 1000);
    }


    }
}

