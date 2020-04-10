'use strict'

var gCanvas;
var gCtx;
var gDraggedLine

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
    renderFirstKeywords()
    loadSavedMemesList()
    renderSavedMemesList()
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
    setMeme(imgId, elImg)
    clearCanvas()
    resetMeme()
    updateKeywordCount(imgId)
    renderFirstKeywords()
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
    document.querySelector('.delete-button-content').hidden = true
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

function onMoveLineKeyboard(ev, delta) {
    // ev.preventDefault()
    const meme = getMeme()
    if (meme.selectedLineIdx || meme.selectedLineIdx === 0) {
        setLineHeightKeyboard(ev, delta)
        renderMeme()
    }

}


function onCanvasClick(ev) {
    const line = isOnLine(ev.offsetX, ev.offsetY)
    if (!line) return
    gMeme.selectedLineIdx = line.index
    document.querySelector('.input-line').value = line.text;
    document.querySelector('.font-selector').value = line.fontFamily
    renderMeme()
}

function onSearchGallery(elInput) {
    document.querySelector('.images-content').innerHTML = '';
    setSearchText(elInput.value)
    renderGallery()
}

function renderKeywords() {
    const keywords = getKeywords()
    const sumKeywords = sumObjectMap(keywords)
    let strHTML = '<ul class="clean-list flex align-center justify-content">'
    for (let [key, value] of Object.entries(keywords)) {
        strHTML += `<li onclick="onFilterGallery(this)" style="font-size:${(value / sumKeywords) * 100}%">${key}</li>`
    }
    strHTML += '<li style="font-size:20%";><span onclick="renderFirstKeywords()">...less</span></li></ul>'
    document.querySelector('.keywords-content').innerHTML = strHTML
}


function renderFirstKeywords() {
    const keywords = getKeywords()
    const sumKeywords = sumObjectMap(keywords)
    const values = Object.values(keywords)
    const keys = Object.keys(keywords)
    let strHTML = '<ul class="clean-list flex align-center justify-content">'

    for (let i = 0; i < 3; i++) {
        strHTML += `<li onclick="onFilterGallery(this)" style="font-size:${(values[i] / sumKeywords) * 100}%">${keys[i]}</li>`
    }
    strHTML += '<li style="font-size:20%";><span onclick="renderKeywords()">...more</span></li></ul>'
    document.querySelector('.keywords-content').innerHTML = strHTML
}


function onFilterGallery(elKeyword) {
    const elKeywords = document.querySelectorAll('.keywords-content li')
    elKeywords.forEach(keyword => {
        keyword.classList.remove('selected')
    })
    elKeyword.classList.add('selected')
    setSearchText(elKeyword.innerText)
    document.querySelector('.search-input').value = elKeyword.innerText
    renderGallery()
}


function onSaveMeme() {
    var isOverwrite = false
    const meme = getMeme()
    var dataURL = gCanvas.toDataURL();
    if (!meme.memeId) {
        var memeId = makeId(6)//prompt('Name?') //todo open modal to get name input
    }
    else {
        //todo open confimration modal for overwrite
        const meme = getMeme()
        var memeId = meme.memeId
        isOverwrite = true
    }
    const memeData = { memeId: memeId, imgURL: dataURL } //todo!!!
    saveMeme(memeData, isOverwrite)
    renderSavedMemesList()
    renderDeleteButton(memeId)
    document.querySelector('.meme-editor').hidden = true;
    document.querySelector('.images-container').style.display = 'block';
}


function renderSavedMemesList1() {
    const memes = loadFromStorage('MEME_LIST')
    if (!memes) return
    let strHTML = '<ul class="memes-list clean-list flex align-center justify-content">'
    memes.forEach(meme => {
        strHTML += `<li onclick="onShowMeme(this)">${meme}</li>`
    })

    strHTML += '</ul>'
    document.querySelector('.saved-memes-content').innerHTML = strHTML
}


function renderSavedMemesList() {
    const memes = loadFromStorage('MEME_LIST')
    if (!memes) return
    let strHTML = '<ul class="memes-list clean-list flex align-center justify-content">'
    memes.forEach(meme => {
        const memeData = loadFromStorage(meme)
        strHTML += `<li><img onclick="onShowMeme('${memeData.memeId}')" src="${memeData.imgURL}"></li>`
    })
    strHTML += '</ul>'
    document.querySelector('.saved-memes-content').innerHTML = strHTML
}

function onShowMeme(memeId) {
    document.querySelector('.meme-editor').hidden = false;
    document.querySelector('.images-container').style.display = 'none';
    const memeHTML = loadFromStorage(memeId).memeHTML
    const imgID = memeHTML.selectedImgID
    const elImg = document.querySelector(`[data-img-id="${imgID}"]`)
    memeHTML.elImg = elImg
    setMemeFromSavedList(memeHTML, memeId)
    clearCanvas()
    renderMeme()
    renderDeleteButton(memeId)
    document.querySelector('.delete-button-content').hidden = false

}

function renderDeleteButton(elLiMemeName) {

    const strHTML = `<button onclick="onDeleteMeme('${elLiMemeName}')">Delete</button>`
    document.querySelector('.delete-button-content').innerHTML = strHTML

}

function onDeleteMeme(memeId) {
    //todo open confimration modal for delete
    deleteMeme(memeId)
    document.querySelector('.meme-editor').hidden = true;
    document.querySelector('.images-container').style.display = 'block';
    renderSavedMemesList()
}


function onResetMeme() {
    clearCanvas()
    resetMeme()
    renderMeme()
}

function isOnLine(x, y) {
    const meme = getMeme()
    var clickedLine = meme.lines.find(line => {
        return y > line.height
            && y < line.height + line.fontSize * 1.2
            && x > 10
            && x < gCanvas.width - 10
    })
    return clickedLine
}

function onMouseDown(ev) {
    const line = isOnLine(ev.offsetX, ev.offsetY)
    if (!line) return
    gDraggedLine = line
    gCanvas.addEventListener("mousemove", onMouseMove)
    gCanvas.addEventListener("mouseup", onMouseUp)

}

function onMouseUp() {
    gCanvas.removeEventListener("mousemove", onMouseMove)
    gCanvas.removeEventListener("mouseup", onMouseUp)
}

function onMouseMove(ev) {
    var offsetX = ev.offsetX
    var offsetY = ev.offsetY
    gDraggedLine.height = offsetY
    renderMeme()
    if (offsetX <= 10 || offsetX >= gCanvas.width - 10 || offsetY <= 10 || offsetY >= gCanvas.height - 10)
        onMouseUp()
}



function onTouchStart(ev) {
    ev.preventDefault()
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    const line = isOnLine(x, y)
    if (!line) return
    console.log('line')
    gDraggedLine = line
    gCanvas.addEventListener("ontouchend", onTouchEnd)
    gCanvas.addEventListener("ontouchnove", onTouchMove)

}

function onTouchEnd() {
    console.log('touch end')
    gCanvas.removeEventListener("ontouchnove", onMouseMove)
    gCanvas.removeEventListener("ontouchend", onMouseUp)
}

function onTouchMove(ev) {
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    gDraggedLine.height = offsetY
    renderMeme()
    if (x <= 10 || x >= gCanvas.width - 10 || y <= 10 || y >= gCanvas.height - 10)
        onTouchEnd()
}