"use strict";

import { GameBoardsContainer } from "./GameBoardsContainer.js";

let gameBoardsContainer = new GameBoardsContainer();
document.getElementById("main-container").appendChild(gameBoardsContainer.container);

gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();