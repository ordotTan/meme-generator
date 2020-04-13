'use strict'

var gMeme = {
    maxId: 0
}

var gSavedMemes = []


function getMeme() {
    return gMeme
}

function setMeme(fileType,imgId,elImg) {
    gMeme.fileType = fileType
    gMeme.elImg = elImg
    gMeme.selectedImgID = imgId
    gMeme.selectedLineIdx = 0
    gMeme.memeId = ''
}

function setMemeFromSavedList(meme,memeId) {
    gMeme = meme
    gMeme.memeId = memeId
}


function updateMemeLineText(text) {
    gMeme.lines[gMeme.selectedLineIdx].text = text
}

function updateLineFontSize(delta) {
    gMeme.lines[gMeme.selectedLineIdx].fontSize += delta
}

function updateLineAlignment(alignType) {
    if (alignType === 'left') gMeme.lines[gMeme.selectedLineIdx].xLoc =  5
    else if (alignType === 'right') gMeme.lines[gMeme.selectedLineIdx].xLoc  = gCanvas.width - 5
    else if (alignType === 'center') gMeme.lines[gMeme.selectedLineIdx].xLoc  = gCanvas.width / 2
    gMeme.lines[gMeme.selectedLineIdx].alignType = alignType
}

function resetMeme() {
    gMeme.lines = []
    addLine()
    addLine() 
    switchLine()
}


function addLine() {
    let lineId
    let y
    if (!gMeme.lines) { lineId = 1 } else lineId = gMeme.maxId++
    switch (gMeme.lines.length) {  //for the text-boxes location... 
        case 0:  //top 
            y = 20;
            break;
        case 1:
            y = gCanvas.height - 80    //bottom 
            break;
        default:
            y = (gCanvas.height - 30) / 2; // middle
            break;
    }
    const line = {
        id: lineId,
        index: gMeme.lines.length,
        xLoc: gCanvas.width/2,
        yLoc: y,
        text: 'Your text',
        alignType: 'center',
        strokeColor: 'black',
        fontColor: 'white',
        fontFamily: 'Impact',
        fontSize: 30
    }
    gMeme.selectedLineIdx = gMeme.lines.length
    gMeme.lines.push(line)
}


function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.lines.forEach((line, idx) => { // giving new indexes after line was removed
        line.index = idx
    })
    gMeme.selectedLineIdx = 0
}

function getLineByID(id) {
    return line = gMeme.lines.find(line =>line.id === id)}

function switchLine() {

    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    return gMeme.lines[gMeme.selectedLineIdx]
}

function changeFont(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily
}

function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fontColor = color
}

function saveMeme(meme,isOverwrite) {
    const memeId = meme.memeId
    meme.meme = gMeme
    saveToStorage(memeId,meme)
    if (!isOverwrite) {
        gSavedMemes.push(memeId)
        saveToStorage('MEME_LIST',gSavedMemes)
    } 
}

function loadSavedMemesList () {
    gSavedMemes = loadFromStorage('MEME_LIST')
    if (!gSavedMemes) gSavedMemes=[]
}

function deleteMeme(memeId) {
    removeFromStorage(memeId)
    gMeme.memeId=''
    const idxToRemove = gSavedMemes.findIndex(savedMeme => memeId === savedMeme)
    gSavedMemes.splice(idxToRemove,1)
    saveToStorage('MEME_LIST',gSavedMemes)
}