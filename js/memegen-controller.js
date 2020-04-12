'use strict'

var gCanvas;
var gCtx;

var gExternalImg // todo still not working right with external upload
// for the drag and drop accuracy
var gClickOffset = {}
var gDraggedLine

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    resizeCanvas()
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'none';
    gCtx = gCanvas.getContext('2d');
    gCtx.fillStyle = 'lightblue'
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
    const elLineColorPicker = document.querySelector('.line-color-picker')
    const elFontColorPicker = document.querySelector('.font-color-picker')
    elLineColorPicker.addEventListener("change", onSetLineColor);
    elFontColorPicker.addEventListener("change", onSetFontColor);
    document.querySelector('.stroke-color').style.boxShadow = "inset 0px 0px 5px 5px black";
    renderFirstKeywords()
    loadSavedMemesList()
    renderStoredMemes()
    renderGallery()
    fillCanvas()
}

function fillCanvas() { // Assigning default img to the meme editor
    const elImg = document.querySelector('.images-gallery img')
    setMeme('internal', 1, elImg)
    clearCanvas()
    resetMeme()
    setTimeout(function () { renderMeme(); }, 500);
}

function resizeCanvas(apsectRatio = 1) { //to switch between mobile and desktop versions
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth * apsectRatio
    gCanvas.height = elContainer.offsetHeight * apsectRatio
}

function resizeCanvasForAspectRatio(apsectRatio = 1) {
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
    setMeme('internal', imgId, elImg)
    clearCanvas()
    resetMeme()
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
    else {
        // console.log('before:',meme.elImg) //todo  for the upload from external..
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

function renderGallery() {
    const images = getImages()
    var strHtmls
    if (images.length === 0) {
        strHtmls = '<img style="margin:auto; width:300px;margin:15px" src="../img/no_images.png">'
        document.querySelector('.images-content').innerHTML = strHtmls
    }
    else {
        strHtmls = images.map(getImgHTML)
        document.querySelector('.images-content').innerHTML = strHtmls.join('')

    }
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
    const meme = getMeme()
    if (meme.lines.length > 0) document.querySelector('.input-line').disabled = false
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    const meme = getMeme()
    if (meme.lines.length === 0) {
        document.querySelector('.input-line').disabled = true
        document.querySelector('.input-line').value = "Need to add a line..."
    }
    renderMeme()
}

function onSwitchLine() {
    const activeLine = switchLine()
    document.querySelector('.input-line').value = activeLine.text;
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


function onDownloadCanvas(elLink) {
    renderMeme(true)
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-awsome-meme.png'
    renderMeme()
}


function onMoveLine(delta) {
    setLineHeight(delta)
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
    let strHTML = '<ul class="clean-list flex align-center justify-content wrap">'
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
    if (elKeyword.classList.contains('selected')) {
        elKeyword.classList.remove('selected')
        document.querySelector('.search-input').value = ''
        setSearchText('')
    }
    else {
        const elKeywords = document.querySelectorAll('.keywords-content li')
        elKeywords.forEach(keyword => {
            keyword.classList.remove('selected')
        })
        elKeyword.classList.add('selected')
        setSearchText(elKeyword.innerText)
        document.querySelector('.search-input').value = elKeyword.innerText
    }
    renderGallery()
}


function onSaveMeme() {

    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'block';
    document.querySelector('.main-nav .editor-link').classList.remove('active');
    document.querySelector('.main-nav .saved-memes-link').classList.add('active');


    var isOverwrite = false
    const meme = getMeme()
    //const origImgURL = meme.originalImgURL
    var dataURL = gCanvas.toDataURL();
    if (!meme.memeId) {
        var memeId = makeId(6)
    }
    else {
        const meme = getMeme()
        var memeId = meme.memeId
        isOverwrite = true
    }
    gMeme.origImgURL11 = gExternalImg
    const memeData = { memeId: memeId, imgURL: dataURL }
    saveMeme(memeData, isOverwrite)
    renderStoredMemes()
    renderDeleteButton(memeId)
}

function renderStoredMemes() {
    const memes = loadFromStorage('MEME_LIST')
    var strHTML = ''
    if (!memes || memes.length === 0) {
        strHTML = '<img style="margin:auto" src="../img/no_images.png">'
    }
    else {
        memes.forEach(meme => {
            const memeData = loadFromStorage(meme)
            strHTML += `<img onclick="onShowMeme(this,'${memeData.memeId}')" src="${memeData.imgURL}">`

        })
    }
    document.querySelector('.images-content-meme').innerHTML = strHTML
}

function onShowMeme(elImg,memeId) {
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
    } else {

        var image = new Image();
        image.src = memeFromStorage.imgURL
        meme.elImg = image
    }
    setMemeFromSavedList(meme, memeId)
    clearCanvas()
    renderMeme()
    renderDeleteButton(memeId)
    document.querySelector('.delete-button-content').hidden = false

}

function renderDeleteButton(elLiMemeName) {
    const strHTML = `<div class="icon-holder" onclick="onDeleteMeme('${elLiMemeName}')" title="Delete Meme"><img class="icon" src="../img/trash.png"</div>`
    document.querySelector('.delete-button-content').innerHTML = strHTML

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
    <div class="control-panel-btn" onclick="onConfirmDelete('${memeId}')">Yes, delete</div>
    <div class="control-panel-btn" onclick="closeModal()">Cancel</div>`
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
    <div class="control-panel-btn" onclick="onConfirmReset()">Yes, reset</div>
    <div class="control-panel-btn" onclick="closeModal()">Cancel</div>`
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
    // console.log(ev)
    const line = isOnText(ev.offsetX, ev.offsetY)
    if (!line) return
    gClickOffset.x = ev.offsetX - line.xLoc
    gClickOffset.y = ev.offsetY - line.yLoc
    gMeme.selectedLineIdx = line.index
    renderMeme() // to mark the selected text box
    document.querySelector('.input-line').value = line.text;
    document.querySelector('.font-selector').value = line.fontFamily

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
    gDraggedLine.yLoc = offsetY - gClickOffset.y
    gDraggedLine.xLoc = offsetX - gClickOffset.x
    renderMeme()
    if (offsetX <= 10 || offsetX >= gCanvas.width - 10 || offsetY <= 10 || offsetY >= gCanvas.height - 10)
        onMouseUp()
}

function onTouchStart(ev) {
    ev.preventDefault()
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    const line = isOnText(x, y)
    if (!line) return
    gClickOffset.x = x - line.xLoc
    gClickOffset.y = y - line.yLoc

    gMeme.selectedLineIdx = line.index
    renderMeme() // to mark the selected text box
    document.querySelector('.input-line').value = line.text;
    document.querySelector('.font-selector').value = line.fontFamily

    gDraggedLine = line
    gCanvas.addEventListener("touchend", onTouchEnd)
    gCanvas.addEventListener("touchmove", onTouchMove)

}

function onTouchEnd() {
    gCanvas.removeEventListener("touchmove", onTouchMove)
    gCanvas.removeEventListener("touchend", onTouchEnd)
}

function onTouchMove(ev) {
    const x = ev.touches[0].clientX - ev.touches[0].target.offsetLeft
    const y = ev.touches[0].clientY - ev.touches[0].target.offsetTop
    gDraggedLine.yLoc = y - gClickOffset.y
    gDraggedLine.xLoc = x - gClickOffset.x
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
    gExternalImg = img // todo - still not working... hold current external img URL
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

function toggleMenu(elLink) {
    handleLinks(elLink)
    switch (elLink.innerText) {
        case 'Gallery':
            document.querySelector('.saved-memes-container').style.display = 'none';
            document.querySelector('.images-container').hidden = false
            document.querySelector('.meme-editor').style.display = 'none'
            break
        case 'Editor':
            document.querySelector('.saved-memes-container').style.display = 'none';
            document.querySelector('.images-container').hidden = true
            document.querySelector('.meme-editor').style.display = 'flex'
            break
        case 'Saved Memes':
            renderStoredMemes()
            document.querySelector('.saved-memes-container').style.display = 'block';
            document.querySelector('.images-container').hidden = true
            document.querySelector('.meme-editor').style.display = 'none'
            break
        case 'About':
            document.querySelector('.saved-memes-container').style.display = 'none';
            document.querySelector('.images-container').hidden = false
            document.querySelector('.meme-editor').style.display = 'none'
    }
    if (window.innerWidth < 740) toggleHamburger()
}

function handleLinks(elLink) {
    const links = document.querySelectorAll('.main-nav li')
    links.forEach(link => link.classList.remove('active'))
    elLink.parentNode.classList.add('active')
}

function onOpenStrokePallete() {
    document.querySelector(".line-color-picker").focus();
    document.querySelector(".line-color-picker").value = "#FFCC00";
    document.querySelector(".line-color-picker").click();
}

function onOpenFontColorPallete() {
    document.querySelector(".font-color-picker").focus();
    document.querySelector(".font-color-picker").value = "#FFCC00";
    document.querySelector(".font-color-picker").click();
}

function toggleHamburger() {
    document.body.classList.toggle('menu-open')
}