"use strict";

export class Ship {

    constructor(size) {
        this.size = size;
    }

    resetShip() {
        let container = document.getElementById("shipsContainer");

        let div = document.createElement("div");
        div.setAttribute("class", `ship ${this.size}`)
        div.textContent = this.size;
        container.appendChild(div);
    }
}