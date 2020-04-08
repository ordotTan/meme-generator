'use strict'

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    // resizeCanvas()
    gCtx = gCanvas.getContext('2d');
    gCtx.fillStyle = 'lightblue'
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)

    renderGallery()
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}


function onSelectImg(elImg, imgId) {
    clearCanvas()
    setMeme(imgId)
    renderMeme(elImg, imgId)
}

function renderMeme(elImg) {
    const meme = getMeme()
    const lines = meme.lines
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    lines.forEach(line => {
        drawText(line.text)
    });
}

function drawText(text, x = 50, y = 50) {
    gCtx.font = '40px Ariel'
    // gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function renderGallery() {
    const images = getImages()
    var strHtmls = images.map(getImgHTML)
    document.querySelector('.images-content').innerHTML = strHtmls.join('')

}

function getImgHTML(image, idx) {
    return `<img data-img-id="${idx + 1}" src="img/${idx + 1}.jpg" onclick="onSelectImg(this,${idx + 1})">`
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
}

function onUpdateLine(elText) {
    updateMemeLine(elText.value)
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    renderMeme(elImg)
}