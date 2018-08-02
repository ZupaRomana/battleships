"use strict";

export class Square {
    constructor() {
//        this.loadDiv();
        this.updateDivColor = function() {
            if (this.isShip & this.isHit) {
                this.div.style.backgroundColor = "red";
            } else if (this.isMiss) {
                this.div.style.backgroundColor = "white";
            }
        }
        this.getHTMLSquare = function() {
            return this.div;
        }
    }

    loadDiv() {
        this.div = document.createElement("div");
        this.div.setAttribute("class", "square");
        this.div.setAttribute("droppable", true);
        this.div.setAttribute("xpos", this.xPos);
        this.div.setAttribute("ypos", this.yPos);
    }

    hasSquareOnCorner(square) {
        let rightXPos = square.xPos - 1;
        let leftXPos = square.xPos + 1;
        let topYPos = square.yPos - 1;
        let bottomYPos = square.yPos + 1;
        return (rightXPos === this.xPos | leftXPos === this.xPos) &
                 (topYPos === this.yPos | bottomYPos === this.yPos);
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