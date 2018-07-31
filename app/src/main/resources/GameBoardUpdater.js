"use strict";

export class GameBoardUpdater {
    constructor() {
    }

    parseGameBoardContainerToJSON(gameBoardContainer) {
        return JSON.stringify(gameBoardContainer);
    }

    parseJSONToGameObject(json) { 
        return JSON.parse(json);
    }
}