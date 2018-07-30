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
        this.div.addEventListener("click", () => {
            alert(`x: ${this.xPos} y: ${this.yPos}`);
            this.div.style.backgroundColor = "#ff3333"
            console.log(`Width: ${this.div.offsetWidth} Height: ${this.div.offsetHeight}`);
        });
    }

    getHTMLSquare() {
        return this.div;
    }

    changeSizeOfSquare(boardWidth, boardHeight, browserZoomLevel) {
        let multipler = browserZoomLevel / 100;
        this.div.style.width = `${boardWidth * 0.09}px`;
        this.div.style.height = `${boardHeight * 0.09}px`;
        if (browserZoomLevel === 300) {
            this.div.style.margin = "0px";
        } else if (browserZoomLevel > 100) {  
            this.div.style.margin = `${1 / multipler}px`;
        } else {
            this.div.style.margin = `${1}px`;
        }
    }
}