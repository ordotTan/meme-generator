'use strict'

var gCanvas
var gCtx

// for the text draggin
var gClickOffset = {}

function fillCanvas() { // Assigning default img to the meme editor
    const elImg = document.querySelector('.images-gallery img')
    setMeme('internal', 1, elImg)
    clearCanvas()
    resetMeme()
    setTimeout(function () {
        renderMeme();
    }, 500);

}

function resizeCanvas(apsectRatio = 1) { //to switch between mobile and desktop versions
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth * apsectRatio
    gCanvas.height = elContainer.offsetHeight * apsectRatio
}

function resizeCanvasForAspectRatio(apsectRatio = 1) { //support various aspect-ratio imgage
    gCanvas.height = gCanvas.width / apsectRatio
    document.querySelector('.canvas-container').style.height = gCanvas.width / apsectRatio + 'px'
}

function onSelectImg(elImg, imgId) {
    const apsectRatio = elImg.width / elImg.height
    resizeCanvasForAspectRatio(apsectRatio)
    document.querySelector('.meme-editor').style.display = 'flex'
    document.querySelector('.images-container').hidden = true;
    document.querySelector('.main-nav .gallery-link').classList.remove('active');
    document.querySelector('.main-nav .editor-link').classList.add('active');
    document.querySelector('.delete-button-content').hidden = true
    setMeme('internal', imgId, elImg)
    clearCanvas()
    resetMeme() //Assing the img with 2 default lines
    updateKeywordCount(imgId)
    renderFirstKeywords()
    renderMeme()
}

function renderMeme(forExternalUse = false) {
    const meme = getMeme()
    const lines = meme.lines
    if (meme.fileType === 'internal') {
        gCtx.drawImage(meme.elImg, 0, 0, gCanvas.width, gCanvas.height);
    }
    else { //    for the upload from external leftover
        gCtx.drawImage(meme.elImg, 0, 0, gCanvas.width, gCanvas.height);
    }
    const markedLine = meme.selectedLineIdx
    lines.forEach(line => {
        if (!forExternalUse) drawTextBox(line, markedLine)
        drawText(line)
    });
}

function drawTextBox(line, markedLine) {
    if (line.index !== markedLine) return
    gCtx.strokeStyle = 'orange'
    document.querySelector('.input-line').value = line.text;
    gCtx.beginPath()
    gCtx.lineWidth = '2'
    gCtx.rect(-5, line.yLoc, gCanvas.width + 5, line.fontSize * 1.2)
    gCtx.stroke()
    gCtx.closePath()
}

function drawText(line, markedLine) {
    if (line.index === markedLine) {
        gCtx.strokeStyle = 'red'
        document.querySelector('.input-line').value = line.text;
    }
    else {
        gCtx.strokeStyle = 'white'
    }
    const startX = line.xLoc
    const height = line.yLoc + line.fontSize
    const text = line.text
    const fontSize = line.fontSize
    const alignType = line.alignType
    const fontFamily = line.fontFamily

    gCtx.lineWidth = '1'
    gCtx.strokeStyle = line.strokeColor
    gCtx.fillStyle = line.fontColor
    gCtx.font = fontSize + 'px ' + fontFamily
    gCtx.textAlign = alignType
    line.textWidth = gCtx.measureText(text).width

    gCtx.fillText(text, startX, height)
    gCtx.strokeText(text, startX, height)

}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
}

function onUpdateText(elText) {
    updateMemeLineText(elText.value)
    renderMeme()
}

function onChangeFontSize(sizeDelta) {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    updateLineFontSize(sizeDelta)
    renderMeme()
}

function onChangeAlignment(alignType) {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    updateLineAlignment(alignType)
    renderMeme()
}

function onAddLine() {
    // debugger
    addLine()
    const elInputBox = document.querySelector('.input-line');
    const meme = getMeme()
    if (meme.lines.length > 0) {
        elInputBox.disabled = false
        document.querySelector('.font-selector').disabled = false
    }
    renderMeme()
}

function onRemoveLine() {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    removeLine()
    onSwitchLine()
    if (meme.lines.length === 0) { //removed last line
        document.querySelector('.input-line').disabled = true
        document.querySelector('.input-line').value = "Need to add a line..."
        document.querySelector('.font-selector').disabled = true
        document.querySelector('.stroke-color').style.boxShadow = "inset 0px 0px 5px 5px black";
        document.querySelector('.font-color').style.boxShadow = ""
    }
    renderMeme()
}

function onSwitchLine() {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    const activeLine = switchLine()
    const elInputBox = document.querySelector('.input-line');
    elInputBox.value = activeLine.text;
    document.querySelector('.font-selector').value = activeLine.fontFamily;
    document.querySelector('.font-color').value = activeLine.fontColor;
    document.querySelector('.font-color').style.boxShadow = "inset 0px 0px 5px 5px " + activeLine.fontColor
    document.querySelector('.stroke-color').value = activeLine.strokeColor;
    document.querySelector('.stroke-color').style.boxShadow = "inset 0px 0px 5px 5px " + activeLine.strokeColor
    renderMeme()
}


function onChangeFont(elFontSelector) {
    changeFont(elFontSelector.value)
    renderMeme()
}

function onSetLineColor(ev) {
    document.querySelector('.stroke-color').style.boxShadow = "inset 0px 0px 5px 5px " + ev.target.value
    setLineColor(ev.target.value)
    renderMeme()
}

function onSetFontColor(ev) {
    document.querySelector('.font-color').style.boxShadow = "inset 0px 0px 5px 5px " + ev.target.value
    setFontColor(ev.target.value)
    renderMeme()
}

function onDownloadMeme(elLink) {
    renderMeme(true)
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-awsome-meme.png'
    renderMeme()
}


function onSaveMeme() {
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'block';
    document.querySelector('.main-nav .editor-link').classList.remove('active');
    document.querySelector('.main-nav .saved-memes-link').classList.add('active');
    var isOverwrite = false
    renderMeme(true) // render without the text-boxes before saving
    const meme = getMeme()
    var dataURL = gCanvas.toDataURL();
    if (!meme.memeId) {
        var memeId = makeId(6)
    }
    else { //replacing existing saved meem
        const meme = getMeme()
        var memeId = meme.memeId
        isOverwrite = true
    }
    const memeData = { memeId: memeId, imgURL: dataURL }
    saveMeme(memeData, isOverwrite)
    renderStoredMemes()
}

function renderStoredMemes() {
    const memes = loadFromStorage('MEME_LIST')
    var strHTML = ''
    if (!memes || memes.length === 0) {
        strHTML = '<img style="margin:auto" src="img/no_images.png">'
    }
    else {
        memes.forEach(meme => {
            const memeData = loadFromStorage(meme)
            strHTML += `<img onclick="onShowMeme(this,'${memeData.memeId}')" src="${memeData.imgURL}">`

        })
    }
    document.querySelector('.images-content-meme').innerHTML = strHTML
}

function onShowMeme(elImg, memeId) {
    const apsectRatio = elImg.width / elImg.height
    resizeCanvasForAspectRatio(apsectRatio)
    document.querySelector('.meme-editor').style.display = 'flex'
    document.querySelector('.saved-memes-container').style.display = 'none';
    document.querySelector('.main-nav .saved-memes-link').classList.remove('active');
    document.querySelector('.main-nav .editor-link').classList.add('active');

    const memeFromStorage = loadFromStorage(memeId)
    const meme = memeFromStorage.meme
    if (meme.fileType === 'internal') {
        const imgID = meme.selectedImgID
        var elImg = document.querySelector(`[data-img-id="${imgID}"]`)
        meme.elImg = elImg
    } else { // From external File
        var image = new Image();
        image.src = memeFromStorage.imgURL
        meme.elImg = image
    }
    setMemeFromSavedList(meme, memeId)
    clearCanvas()
    renderMeme()
    onSwitchLine()
    renderDeleteButton(memeId)
    document.querySelector('.delete-button-content').hidden = false
}

function renderDeleteButton(elLiMemeName) {
    const strHTML = `<div onclick="onDeleteMeme('${elLiMemeName}')" title="Delete Meme"><img class="icon" src="img/trash.png"</div>`
    document.querySelector('.delete-button-content').innerHTML = strHTML
    document.querySelector('.delete-button-content').hidden = false

}

function onDeleteMeme(memeId) {
    renderDeleteModal(memeId)
    document.querySelector('.modal').hidden = false;
}

function onConfirmDelete(memeId) {
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'block';
    document.querySelector('.main-nav .editor-link').classList.remove('active');
    document.querySelector('.main-nav .saved-memes-link').classList.add('active');
    document.querySelector('.modal').hidden = true;
    deleteMeme(memeId)
    fillCanvas()
    renderStoredMemes()
}

function renderDeleteModal(memeId) {
    var strHTML = `Are you sure?</div>
    <div class="modal-btn" onclick="onConfirmDelete('${memeId}')">Yes, delete</div>
    <div class="modal-btn" onclick="closeModal()">Cancel</div>`
    document.querySelector('.modal-content').innerHTML = strHTML
}

function closeModal() {
    document.querySelector('.modal').hidden = true;
}

function onResetMeme() {
    renderConfirmResetModal()
    document.querySelector('.modal').hidden = false;
}

function onConfirmReset() {
    document.querySelector('.modal').hidden = true;
    clearCanvas()
    resetMeme()
    renderMeme()
}

function renderConfirmResetModal() {
    var strHTML = `Are you sure?</div>
    <div class="modal-btn" onclick="onConfirmReset()">Yes, reset</div>
    <div class="modal-btn" onclick="closeModal()">Cancel</div>`
    document.querySelector('.modal-content').innerHTML = strHTML
}

function isOnText(x, y) {
    const meme = getMeme()
    var rightLimit
    var leftLimit
    var clickedLine = meme.lines.find(line => {
        switch (line.alignType) {
            case 'center':
                leftLimit = line.xLoc - line.textWidth / 2
                rightLimit = line.xLoc + line.textWidth / 2
                break;
            case 'right':
                leftLimit = line.xLoc - line.textWidth
                rightLimit = line.xLoc
            case 'left':
                leftLimit = 0
                rightLimit = line.xLoc + line.textWidth
        }
        return y > line.yLoc
            && y < line.yLoc + line.fontSize
            && x > leftLimit
            && x < rightLimit
    })
    return clickedLine
}

function onMouseDown(ev) {
    const meme = getMeme()
    const line = isOnText(ev.offsetX, ev.offsetY)
    if (!line) return
    gClickOffset.x = ev.offsetX - line.xLoc
    gClickOffset.y = ev.offsetY - line.yLoc
    meme.selectedLineIdx = line.index
    renderMeme() // to mark the selected text box
    document.querySelector('.input-line').value = line.text;
    document.querySelector('.input-line').select()
    document.querySelector('.font-selector').value = line.fontFamily

    meme.lines[gMeme.selectedLineIdx] = line
    gCanvas.addEventListener("mousemove", onMouseMove)
    gCanvas.addEventListener("mouseup", onMouseUp)

}

function onMouseUp() {
    gCanvas.removeEventListener("mousemove", onMouseMove)
    gCanvas.removeEventListener("mouseup", onMouseUp)
}

function onMouseMove(ev) {
    const meme = getMeme()
    const activeLine = meme.lines[gMeme.selectedLineIdx]
    var offsetX = ev.offsetX
    var offsetY = ev.offsetY
    activeLine.yLoc = offsetY - gClickOffset.y
    activeLine.xLoc = offsetX - gClickOffset.x
    renderMeme()
    if (offsetX <= 10 || offsetX >= gCanvas.width - 10 || offsetY <= 10 || offsetY >= gCanvas.height - 10)
        onMouseUp()
}

function onTouchStart(ev) {
    ev.preventDefault()
    const meme = getMeme()
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    const line = isOnText(x, y)
    if (!line) return
    gClickOffset.x = x - line.xLoc
    gClickOffset.y = y - line.yLoc

    meme.selectedLineIdx = line.index
    renderMeme() // to mark the selected text box
    document.querySelector('.input-line').value = line.text;
    document.querySelector('.font-selector').value = line.fontFamily

    meme.lines[gMeme.selectedLineIdx] = line
    gCanvas.addEventListener("touchend", onTouchEnd)
    gCanvas.addEventListener("touchmove", onTouchMove)

}

function onTouchEnd() {
    gCanvas.removeEventListener("touchmove", onTouchMove)
    gCanvas.removeEventListener("touchend", onTouchEnd)
}

function onTouchMove(ev) {
    const meme = getMeme()
    const activeLine = meme.lines[gMeme.selectedLineIdx]
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    activeLine.yLoc = y - gClickOffset.y
    activeLine.xLoc = x - gClickOffset.x
    renderMeme()
}


function renderImgFromFile(img) {
    document.querySelector('.meme-editor').style.display = 'flex'
    document.querySelector('.images-container').hidden = true;
    document.querySelector('.main-nav .gallery-link').classList.remove('active');
    document.querySelector('.main-nav .editor-link').classList.add('active');
    const apsectRatio = img.width / img.height
    resizeCanvasForAspectRatio(apsectRatio)
    clearCanvas()
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    setMeme('external', 999, img)
    resetMeme()
    const meme = getMeme()
    const lines = meme.lines
    const markedLine = meme.selectedLineIdx
    lines.forEach(line => {
        drawTextBox(line, markedLine)
        drawText(line, markedLine)
    });
    document.querySelector('.delete-button-content').hidden = true
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderImgFromFile)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


function onOpenStrokePallete() {
    const meme = getMeme()
    if (meme.lines.length === 0) return
    document.querySelector(".line-color-picker").focus();
    document.querySelector(".line-color-picker").value = "#FFCC00";
    document.querySelector(".line-color-picker").click();
}

function onOpenFontColorPallete() {
    const meme = getMeme()
    if (meme.lines.length === 0) return

    document.querySelector(".font-color-picker").focus();
    document.querySelector(".font-color-picker").value = "#FFCC00";
    document.querySelector(".font-color-picker").click();
}


function onInlineEdit(ev) {
}

function onInlineEditTemp(ev) {
    const line = isOnText(ev.offsetX, ev.offsetY)
    if (!line) return
    const elInLineInputBox = document.querySelector('.inline-input');
    const elInlineInput = document.querySelector('.inline-input input');
    // console.log(ev.offsetX)
    // console.log(ev.offsetY)

    elInLineInputBox.style.left = line.xLoc + 'px'
    elInLineInputBox.style.top = line.yLoc + 'px'// - .height + `px`;
    elInLineInputBox.style.display = 'block';
    elInLineInputBox.style.width = gCanvas.width + 'px'

    console.log(elInlineInput)
    elInlineInput.value = line.text
    elInlineInput.style.fontSize = line.fontSize + 'px';
    elInlineInput.style.font = line.font
    elInlineInput.focus()
    elInlineInput.select()

    // elInLineInput.style.height = line.height + 20 + `px`;


}

function onFinishInline() {
    // const elInLineInputBox = document.querySelector('.inline-input');
    // elInLineInputBox.style.display = 'none';
}
