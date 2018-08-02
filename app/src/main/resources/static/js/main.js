"use strict";

import { LoginPage } from "./LoginPage.js";
import {GameBoardsContainer} from "./GameBoardsContainer.js";

let app = new LoginPage();
app.launch();

export let gameBoard = function() {
    let gameBoardsContainer = new GameBoardsContainer();
    document.getElementById("main-container").appendChild(gameBoardsContainer.container);
    
    gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
    
}
