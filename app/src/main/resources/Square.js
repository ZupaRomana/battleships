"use strict";

export class Square {
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.loadDiv();
    }

    loadDiv() {
        this.div = document.createElement("div");
        this.div.setAttribute("class", "square");
        this.div.textContent = `x: ${this.xPos} y: ${this.yPos}`;
    }

    getHTMLSquare() {
        return this.div;
    }
}