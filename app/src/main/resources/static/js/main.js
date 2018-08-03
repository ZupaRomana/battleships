"use strict";

import { LoginPage } from "./LoginPage.js";
import {GameBoardsContainer} from "./GameBoardsContainer.js";

let app = new LoginPage();
app.launch();

export let gameBoard = function(gameBoardUpdater, redirectInterval) {
    
    if (redirectInterval) {
        clearInterval(redirectInterval);
    }

    let interval = setInterval(() => { 
        console.log("gameBoard interval");
        gameBoardUpdater.getJSONFromServerInitial();
     }, 2000);

    if (localStorage.getItem("enemyMap")) {
        clearInterval(interval);
        gameBoardUpdater.postJSONToServer(localStorage.getItem("map"), true);
        let gameBoardsContainer = new GameBoardsContainer();
        document.getElementById("main-container").appendChild(gameBoardsContainer.container);
        gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
        document.getElementById("lobby").remove();
    } else {
        console.log("reasources not loaded");
    } 
}
