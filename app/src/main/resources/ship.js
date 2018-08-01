"use strict";
import { Square } from "./Square.js";
import { GameBoard } from "./GameBoard.js";

var ships = [];
var _map;
var id = 0;
export class Ship {

    constructor(size, map) {
        this.size = size;
        this.position = "horizontal";
        this.width = size * 50;
        this.height = 50;
        _map = map;
        this.id = id;
        id++;
        ships.push(this);
        this.addDraggable();
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

    addDraggable() {
        document.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("Text", event.target.id);
        });
        // document.addEventListener("dragenter", function(event) {
        //     if ( event.target.className == "square" ) {
        //         event.target.style.border = "3px dotted green";
        //     }
        // });

        document.addEventListener("dragleave", function(event) {
            if ( event.target.className == "square" ) {
                event.target.style.border = "";
            }
        });

        document.addEventListener("dragover", function(event) {
            event.preventDefault();
        });
        document.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event.target.className == "square") {
                // event.target.style.backgroundColor = "black";
                // event.target.setAttribute("isShip", true);
                // event.target.setAttribute("droppable", false);
                let data = event.dataTransfer.getData("Text");
                let shipToRemove = document.getElementById(data);
                document.getElementById("shipsContainer").removeChild(shipToRemove);

                putShip(event, _map, ships[data - 1]);
                $("#resetButton").attr("disabled", false);
            }
        })
    }

    resetShip() {

        let container = document.getElementById("shipsContainer");



        let ship = document.createElement("div");
        ship.setAttribute("id", id);
        ship.setAttribute("class", `ship${this.size}`);
        container.appendChild(ship);
        ship.setAttribute("draggable", true);
    }
}
    function putShip(event, map, ship) {

        let target = $(event.target.closest(".square"));
        
        let square = map.getSquare($(target).attr("xpos"), $(target).attr("ypos"));
        square.isShip = true;
        
        colorAllSquares(square, ship);

        // $(event.target.closest(".square")).css("backgroundColor", "black");
        // $(event.target.closest(".square")).attr("isShip", true);
        // square.updateDivColor();


        // let ships = document.getElementsByClassName("shipDiv");
        // for (let ship of ships) {
        //     if (!ship.hasChildNodes()) {
        //         ship.remove();
        //     }
        // }
    }

    function colorAllSquares(square, ship) {

        // alert(ship.size);
        if (ship.position === "vertical") {
            for (let i = 0; i < ship.size; i++) {
                let nextSquare = _map.getSquare(square.xPos, square.yPos + i);
                nextSquare.isShip = true;
                nextSquare.updateDivColor();
            }

        } else {
            for (let i = 0; i < ship.size; i++) {
                let nextSquare = _map.getSquare(square.xPos + i, square.yPos);
                nextSquare.isShip = true;
                nextSquare.getHTMLSquare().setAttribute("droppable", false);

                // for (let i = 0; document.getElementById("#game-board").childNodes.length; i++) {
                //     if (document.getElementById("#game-board").childNodes[i].getAttribute)
                // }
                // $(".game-board").innerHTML = map.getPlayerGameBoard();
                // $(".game-board").remove();
                // document.getElementById("main-container").appendChild(_map.getPlayerGameBoard());
                // document.getElementById("main-container").appendChild(ships);
                nextSquare.updateDivColor();
            }
        }
}
