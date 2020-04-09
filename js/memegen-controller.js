'use strict'

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    // resizeCanvas()
    gCtx = gCanvas.getContext('2d');
    gCtx.fillStyle = 'lightblue'
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)

    const elLineColorPicker = document.querySelector('.line-color-picker')
    const elFontColorPicker = document.querySelector('.font-color-picker')
    elLineColorPicker.addEventListener("change", onSetLineColor);
    elFontColorPicker.addEventListener("change", onSetFontColor);
    renderKeywords()
    renderGallery()
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}


function onSelectImg(elImg, imgId) {
    document.querySelector('.meme-editor').hidden = false;
    document.querySelector('.images-container').style.display = 'none';
    const meme = getMeme()
    meme.elImg = elImg
    clearCanvas()
    resetMeme()
    setMeme(imgId)
    updateKeywordCount(imgId)
    renderKeywords()
    renderMeme()
}


function renderMeme(forExternalUse = false) {

    const meme = getMeme()
    const lines = meme.lines
    gCtx.drawImage(meme.elImg, 0, 0, gCanvas.width, gCanvas.height);
    const markedLine = meme.selectedLineIdx
    lines.forEach(line => {
        if (!forExternalUse) drawTextBox(line, markedLine)
        drawText(line)
    });
}

function drawTextBox(line, markedLine) {
    if (line.index === markedLine) {
        gCtx.strokeStyle = 'red'
        document.querySelector('.input-line').value = line.text;
    }
    else {
        gCtx.strokeStyle = 'white'
    }
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.rect(10, line.height, gCanvas.width - 20, line.fontSize * 1.2)
    gCtx.stroke()
    gCtx.closePath()
}


function drawText(line) {
    var startX
    const height = line.height + line.fontSize
    const text = line.text
    const fontSize = line.fontSize
    const alignType = line.alignType
    const fontFamily = line.fontFamily

    gCtx.lineWidth = '1'
    gCtx.strokeStyle = line.strokeColor
    gCtx.fillStyle = line.fontColor
    gCtx.font = fontSize + 'px ' + fontFamily


    gCtx.textAlign = alignType
    if (alignType === 'left') startX = 20
    else if (alignType === 'right') startX = gCanvas.width - 20
    else startX = gCanvas.width / 2
    gCtx.fillText(text.toUpperCase(), startX, height)
    gCtx.strokeText(text.toUpperCase(), startX, height)

}

function renderGallery() {
    const images = getImages()
    if (!images) return
    var strHtmls = images.map(getImgHTML)
    document.querySelector('.images-content').innerHTML = strHtmls.join('')
}

function getImgHTML(image, idx) {
    return `<img data-img-id="${idx + 1}" src="img/${image.id}.jpg" onclick="onSelectImg(this,${image.id})">`
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
}

function onUpdateLine(elText) {
    updateMemeLineText(elText.value)
    renderMeme()
}


function onChangeFontSize(sizeDelta) {
    updateLineFontSize(sizeDelta)
    renderMeme()
}

function onChangeAlignment(alignType) {
    updateLineAlignment(alignType)
    renderMeme()
}


function onAddLine() {
    addLine()
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function onSwitchLine() {
    const activeLine = switchLine()
    document.querySelector('.input-line').value = activeLine.text;
    document.querySelector('.font-selector').value = activeLine.fontFamily
    renderMeme()
}


function onChangeFont(elFontSelector) {
    changeFont(elFontSelector.value)
    renderMeme()
}

function onSetLineColor(ev) {
    setLineColor(ev.target.value)
    renderMeme()
}


function onSetFontColor(ev) {
    setFontColor(ev.target.value)
    renderMeme()
}


function onDownloadCanvas(elLink) {
    renderMeme(true)
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-awsome-meme.png'
}


function onMoveLine(delta) {
    setLineHeight(delta)
    renderMeme()
}

function onMoveLineKeyboard(ev,delta) {
    // ev.preventDefault()
    const meme = getMeme()
    if (meme.selectedLineIdx || meme.selectedLineIdx ===0 ) {
    setLineHeightKeyboard(ev,delta)
    renderMeme()
    }

}

function onCanvasClicked(ev) {

    var offsetX = ev.offsetX
    var offsetY = ev.offsetY
    const meme = getMeme()

    var clickedLine = meme.lines.find(line => {
        return offsetY > line.height
            && offsetY < line.height + line.fontSize * 1.2
            && offsetX > 10
            && offsetX < gCanvas.width - 10
    })
    if (!clickedLine) return
    
    gMeme.selectedLineIdx = clickedLine.index
    document.querySelector('.input-line').value = clickedLine.text;
    document.querySelector('.font-selector').value = clickedLine.fontFamily
    renderMeme()
}

function onSearchGallery(elInput) {
    document.querySelector('.images-content').innerHTML='';
    setSearchText(elInput.value)
    renderGallery()
}

function renderKeywords() {
    const keywords = getKeywords()
    const sumKeywords = sumObjectMap(keywords)
    let strHTML='<ul class="clean-list flex align-center justify-content">'
    for (let [key, value] of Object.entries(keywords)) {
       strHTML+=`<li onclick="onFilterGallery(this)" style="font-size:${(value/sumKeywords)*100}%">${key}</li>`
    }
    strHTML+='</ul>'
    document.querySelector('.keywords-content').innerHTML = strHTML
}


//todo - give active style to the clicked keyword
function onFilterGallery(elKeyword) {
    setSearchText(elKeyword.innerText)
    document.querySelector('.search-input').value = elKeyword.innerText
    renderGallery()
}

