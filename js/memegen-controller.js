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
    setMeme(imgId)
    renderMeme(elImg)
}


function renderMeme(elImg) {
    const meme = getMeme()
    const lines = meme.lines
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
    const markedLine = meme.selectedLineIdx
    lines.forEach(line => {
        drawTextBox(line, markedLine)
        drawText(line)
    });
}

function drawTextBox(line, markedLine) {
    if (line.index === markedLine) {
        gCtx.strokeStyle = 'red'
        document.querySelector('.input-line').value=line.text;
    }
    else  {
        gCtx.strokeStyle = 'white'
    }
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.rect(10, line.height, gCanvas.width - 20, line.fontSize*1.2)
    gCtx.stroke()
    gCtx.closePath()
}


function drawText(line, x) {

    const height = line.height+line.fontSize 
    const text = line.text
    const fontSize = line.fontSize
    const alignType = line.alignType
    gCtx.font = fontSize + 'px impact'
    gCtx.lineWidth = '1'
    gCtx.strokeStyle = 'black'
    gCtx.textAlign = alignType
    if (alignType === 'left') x = 20
    else if (alignType === 'right') x = gCanvas.width - 20
    else x = gCanvas.width / 2
    gCtx.fillText(text, x, height)
    gCtx.strokeText(text, x, height)

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
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    addLine()
    document.querySelector('.input-line').value=''
    renderMeme(elImg)
}

function onRemoveLine() {
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    removeLine()
    renderMeme(elImg)
}

function onSwitchLine() {
    const meme = getMeme()
    const elImg = document.querySelector(`[data-img-id="${meme.selectedImgID}"]`)
    const activeLine = switchLine()
    document.querySelector('.input-line').value=activeLine.text;
    renderMeme(elImg)
}
