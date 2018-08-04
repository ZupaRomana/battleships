"use strict";
import { Square } from "./Square.js";
import { GameBoard } from "./GameBoard.js";
import { GameBoardUpdater } from "./GameBoardUpdater.js";

var ships = [];
var _map = [];
var id = 0;
var counter = 0;
export class Ship {

    constructor(size, map) {
        this.size = size;
        this.position = "horizontal";
        _map = map;
        this.id = id;
        id++;
        ships.push(this);
    }

    addDraggable() {
        document.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("Text", event.target.id);
        });

        document.addEventListener("dragleave", function (event) {
            if (event.target.className == "square") {
                event.target.style.border = "";
            }
        });

        document.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        document.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event.target.className == "square") {
                let data = event.dataTransfer.getData("Text");
                let shipToRemove = document.getElementById(data);
                document.getElementById("shipsContainer").removeChild(shipToRemove);

                putShip(event, _map, ships[data - 1]);
                $("#resetButton").attr("disabled", false);
            }
        })
    }

    resetShip() {

        this.addDraggable();
        let container = document.getElementById("shipsContainer");

        let ship = document.createElement("div");
        ship.setAttribute("id", id);
        ship.setAttribute("class", `ship${this.size}`);

        ship.addEventListener("dblclick", function () {
            ships[this.id - 1].position = "vertical";
            let height = this.offsetHeight;
            let width = this.offsetWidth;
            this.style.height = width + "px";
            this.style.width = height + "px";
        });

        container.appendChild(ship);

        ship.setAttribute("draggable", true);
    }
}
function putShip(event, map, ship) {

    counter++;
    let target = $(event.target.closest(".square"));

    let square = map.getSquare($(target).attr("xpos"), $(target).attr("ypos"));
    square.isShip = true;

    colorAllSquares(square, ship);
    checkShipsAmount();
}

function checkShipsAmount() {

    if (counter == 10) {
        $("#saveButton").attr("disabled", false);
       document.getElementById("saveButton").addEventListener("click", function() {saveToLocalStorage()});
    }
}

function saveToLocalStorage() {
    let allSquares = JSON.stringify(_map);
    localStorage.setItem("map", allSquares);
}

function colorAllSquares(square, ship) {

    if (ship.position == "vertical") {
        for (let i = 0; i < ship.size; i++) {
            let nextSquare = _map.getSquare(square.xPos, square.yPos + i);
            nextSquare.getHTMLSquare().style.backgroundColor = "black";
            nextSquare.getHTMLSquare().setAttribute("droppable", false);
            nextSquare.isShip = true;
        }
    } else {
        for (let i = 0; i < ship.size; i++) {
            let nextSquare = _map.getSquare(square.xPos + i, square.yPos);
            nextSquare.isShip = true;
            nextSquare.getHTMLSquare().style.backgroundColor = "black";
            nextSquare.getHTMLSquare().setAttribute("isShip", true);
            nextSquare.getHTMLSquare().setAttribute("droppable", false);
        }
    }
}
