"use strict";
import { Square } from "./Square.js";

export class Ship {

    constructor(size) {
        this.size = size;
        this.position = "horizontal";
        this.drawShip();
        this.width = 50;
        this.height = size * 50;
    }

    drawShip() {
        if (this.position === "horizontal") {
            this.width = 50 * this.size;
            this.height = 50;
        } else {
            this.style.height = 50 * this.size;
            this.stye.width = 50;
        }
    }

    resetShip() {
        let container = document.getElementById("shipsContainer");

        let div = document.createElement("div");
        div.setAttribute("class", "shipDiv");
        div.textContent = this.size;
        container.appendChild(div);

        let ship = document.createElement("div");
        ship.setAttribute("class", "free-ship");
        ship.setAttribute("class", `ship${this.size}`);
        div.appendChild(ship);
        ship.setAttribute("draggable", true);

        $(function () {
            $(ship).draggable({
                containment: '.game-board',
                cursor: 'move',
                revert: true
                // stop: function(event) {
                //     // $(event.target).remove();
                // }
                });
            });


        $(function () {
            $('.square').droppable({
                drop: handleDrop
            });
        });

        function checkSquare(event, ui) {
            if (event.target.isShip) {
                $(ui.draggable).css("backgroundColor", "red");
            } else {
                $(ui.draggable).css("backgroundColor", "green");
            }
        }

        function handleDrop(event, ui) {
            ui.draggable.position({
                of: $(this),
                my: 'left top',
                at: 'left top'
            });
            ui.draggable.draggable('option', 'revert', false);
            ui.draggable.draggable("option", "grid", [49, 49]);
            $(event.target).closest(".square").isShip = true;
            // $(event.target).closest(".square").css("backgroundColor", "black");
            $("#resetButton").attr("disabled", false);
        }

        ship.addEventListener("dblclick", function() {
            this.position = "vertical";
        });
    }
}