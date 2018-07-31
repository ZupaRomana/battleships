"use strict";

export class GameBoardUpdater {
    constructor() {
    }

    parseGameBoardContainerToJSON(gameBoardContainer) {
        return JSON.stringify(gameBoardContainer);
    }

    parseJSONToObject(json) { 
        return JSON.parse(json);
    }

    updatePlayerMap(json) {
        let receivedGameBoardContainer = this.parseJSONToObject(json);
    }
}