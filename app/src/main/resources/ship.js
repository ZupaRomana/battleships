"use strict";
import { Square } from "./Square.js";
import { GameBoard } from "./GameBoard.js";

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

    resetShip() {

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

addDraggable();

function addDraggable() {
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
        if (event.target.className == "square" && event.target.getAttribute("droppable") === "true") {
            let data = event.dataTransfer.getData("Text");
            let target = $(event.target.closest(".square"));
            putShip(target, _map, data);
            $("#resetButton").attr("disabled", false);
        };
    });
}


function putShip(target, map, data) {

    counter++;

    let square = map.getSquare($(target).attr("xpos"), $(target).attr("ypos"));

    colorAllSquares(square, data);
    checkShipsAmount();
}

function checkShipsAmount() {

    if (counter == 10) {
        $("#saveButton").attr("disabled", false);
        document.getElementById("saveButton").addEventListener("click", function () { saveToLocalStorage() });
    }
}

function saveToLocalStorage() {

    let allSquares = JSON.stringify(_map);
    localStorage.setItem("map", allSquares);
}

function colorAllSquares(square, data) {

    let ship = ships[data - 1];
    let squares = [];

    if (ship.position == "vertical") {
        for (let i = 0; i < ship.size; i++) {
            let nextSquare = _map.getSquare(square.xPos, square.yPos + i);
            squares.push(nextSquare);
        }
    } else {
        for (let i = 0; i < ship.size; i++) {
            let nextSquare = _map.getSquare(square.xPos + i, square.yPos);
            squares.push(nextSquare);
        }
    };

    checkAndChangeNextSquareStatus(squares, data);
}

function checkAndChangeNextSquareStatus(squares, data) {

    for (let square of squares) {
        if (typeof square === "undefined") {
            squares = [];
        }
    }

    if (squares.length > 0 && !isNeighbourhoodFree(squares)) {
        for (let nextSquare of squares) {
            nextSquare.getHTMLSquare().style.backgroundColor = "black";
            nextSquare.getHTMLSquare().setAttribute("droppable", false);
            nextSquare.getHTMLSquare().setAttribute("isShip", true);
            nextSquare.isShip = true;
        }

        let shipToRemove = document.getElementById(data);
        document.getElementById("shipsContainer").removeChild(shipToRemove);
    }
}

function isNeighbourhoodFree(squares) {

    for (let square of squares) {

        let neighbours = getAllNeighbours(square);
        
        for (let neighbour of neighbours) {
            if (typeof neighbour !== "undefined" && neighbour.isShip) {
                return true;
            }
        }
    }
    return false;
}

function getAllNeighbours(square) {

    let neighbours = [];
    let rightNeighbour = getNeighbour(square, 1, 0);
    neighbours.push(rightNeighbour);

    let leftNeighbour = getNeighbour(square, -1, 0);
    neighbours.push(leftNeighbour);

    let topNeighbour = getNeighbour(square, 0, 1);
    neighbours.push(topNeighbour);

    let downNeighbour = getNeighbour(square, 0, -1);
    neighbours.push(downNeighbour);

    let rightTopNeighbour = getNeighbour(square, 1, 1);
    neighbours.push(rightTopNeighbour);

    let rightDownNeighbour = getNeighbour(square, 1, -1);
    neighbours.push(rightDownNeighbour);

    let leftTopNeighbour = getNeighbour(square, -1, 1);
    neighbours.push(leftTopNeighbour);

    let leftDownNeighbour = getNeighbour(square, -1, -1);
    neighbours.push(leftDownNeighbour);

    return neighbours;
}

function getNeighbour(square, xChange, yChange) {

    let neighbour = _map.getSquare(square.xPos + xChange, square.yPos + yChange);
    if (typeof neighbour !== "undefined") {
        return neighbour;
    }
}
