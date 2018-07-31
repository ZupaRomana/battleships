"use strict";

import { GameBoardsContainer } from "./GameBoardsContainer.js";

let gameBoardsContainer = new GameBoardsContainer();
document.body.appendChild(gameBoardsContainer.container);

gameBoardsContainer.scaleGameBoardToBrowserZoomLevel();