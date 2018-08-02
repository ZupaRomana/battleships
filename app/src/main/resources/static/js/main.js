"use strict";
<<<<<<< HEAD
"use strict";

import { GameBoardsContainer } from "./GameBoardsContainer.js";
import { Welcome } from "./welcomePage.js";

//let welcome = new Welcome();
// welcome.run();

export let gameBoard = function() {
    let gameBoardsContainer = new GameBoardsContainer();
    document.getElementById("main-container").appendChild(gameBoardsContainer.container);

    gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
}

gameBoard();
=======

import { LoginPage } from "./LoginPage.js";

let app = new LoginPage();
app.launch();

//export let gameBoard = function() {
// let gameBoardsContainer = new GameBoardsContainer();
// document.getElementById("main-container").appendChild(gameBoardsContainer.container);

// gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();
//}
>>>>>>> origin/serverOn
