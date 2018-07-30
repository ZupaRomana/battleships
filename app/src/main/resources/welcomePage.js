"use strict";

let mainDiv = document.querySelector(`#main-container`);

let contentDiv = document.createElement(`div`);
contentDiv.setAttribute(`id`, `content-container`);

let header = document.createElement(`header`);
header.innerHTML = `Battleships v1.1`;

let form = document.createElement(`form`);
form.setAttribute(`id`, `submits-container`);
form.setAttribute(`method`, `POST`);

let input = document.createElement(`input`);
input.setAttribute(`type`, `text`);
input.setAttribute(`placeholder`, `Enter your name`);
input.setAttribute(`required`, ``);

let br = document.createElement(`br`);

let inputSubmit = document.createElement(`input`);
inputSubmit.setAttribute(`type`, `submit`);
inputSubmit.setAttribute(`value`, `Start`);

mainDiv.appendChild(contentDiv);

[header, form].forEach(element => {
    contentDiv.appendChild(element);
});

[input, br, inputSubmit].forEach(element => {
    form.appendChild(element);
})