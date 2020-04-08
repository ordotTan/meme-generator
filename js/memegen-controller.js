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
    const meme = getMeme()
    clearCanvas()
    clearCurrMeme()
    // document.querySelector('.input-line').value = '';
    setMeme(imgId)
    renderInputs(meme)
    renderMeme(elImg)
}


function renderMeme(elImg) {
    const meme = getMeme()
    const lines = meme.lines
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    lines.forEach(line => {
        drawText(line.text)
    });
}

function drawText(text, x = gCanvas.width / 2, y = 50) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    const fontSize = line.fontSize
    const alignType = line.alignType
    gCtx.font = fontSize + 'px impact'
    gCtx.textAlign = alignType
    gCtx.fillText(text, x, y, gCanvas.width)
    gCtx.strokeText(text, x, y, gCanvas.width)
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
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    updateMemeLineText(elText.value)
    renderMeme(elImg)
}


function onChangeFontSize(sizeDelta) {
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    updateLineFontSize(sizeDelta)
    renderMeme(elImg)
}

function onChangeAlignment(alignType) {
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    updateLineAlignment(alignType)
    renderMeme(elImg)
}


function onAddLine() {
    renderInput()
}

function onSwithchLine() {

}

function renderInputs(meme) {
    const lines = meme.lines
    var strHtmls = lines.map(getInputsHTML)
    document.querySelector('.text-inputs-content').innerHTML = strHtmls.join('')
}

function getInputsHTML(line, idx) {
    return `<input class="input-line" type=text onkeyup="onUpdateLine(this)"></input>`
}