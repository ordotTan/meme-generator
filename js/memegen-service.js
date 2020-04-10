'use strict'

var gKeywords = {
    'awsome': 10,
    'happy': 2,
    'sad': 4,
    'funny': 2,
    'strong': 6,
    'vip': 6
}

var gSavedMemes = []

var gSearchText = ''

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['happy', 'sad'] },
    { id: 2, url: 'img/2.jpg', keywords: ['sad'] },
    { id: 3, url: 'img/3.jpg', keywords: ['afunny'] },
    { id: 4, url: 'img/4.jpg', keywords: ['happy'] },
    { id: 5, url: 'img/5.jpg', keywords: ['sad'] },
    { id: 6, url: 'img/6.jpg', keywords: ['sad'] },
    { id: 7, url: 'img/7.jpg', keywords: ['happy'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny'] },
    { id: 9, url: 'img/9.jpg', keywords: ['sad'] },
    { id: 10, url: 'img/10.jpg', keywords: ['sad'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['happy'] },
    { id: 13, url: 'img/13.jpg', keywords: ['sad'] },
    { id: 14, url: 'img/14.jpg', keywords: ['funny'] },
    { id: 15, url: 'img/15.jpg', keywords: ['sad'] },
    { id: 16, url: 'img/16.jpg', keywords: ['sad'] },
    { id: 17, url: 'img/17.jpg', keywords: ['bbc'] },
    { id: 18, url: 'img/18.jpg', keywords: ['bba'] }
]

var gMeme = {
    maxId: 0
}

function getImages() {
    if (!gSearchText) return gImgs
    var images = gImgs.filter(checkImg)
    return images
}

function checkImg(img) {
    var img = img.keywords.some(word => word.startsWith(gSearchText))
    return img
}

function setSearchText(searchText) {
    gSearchText = searchText
}

function setMeme(fileType,imgId,elImg) {
    gMeme.fileType = fileType
    gMeme.elImg = elImg
    gMeme.selectedImgID = imgId
    gMeme.selectedLineIdx = 0
    // if (fileType==='external') gMeme.origImgURL = elImg
}

function setMemeFromSavedList(meme,memeId) {
    gMeme = meme
    gMeme.memeId = memeId
}

function getMeme() {
    return gMeme
}



function getFontSize() {
    return gMeme.lines[gMeme.selectedLineIdx].fontSize
}

function updateMemeLineText(text) {
    gMeme.lines[gMeme.selectedLineIdx].text = text
}

function updateLineFontSize(delta) {
    gMeme.lines[gMeme.selectedLineIdx].fontSize += delta
}

function updateLineAlignment(alignType) {
    if (alignType === 'left') gMeme.lines[gMeme.selectedLineIdx].xLoc =  20
    else if (alignType === 'right') gMeme.lines[gMeme.selectedLineIdx].xLoc  = gCanvas.width - 20
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
            y = gCanvas.height - 60    //bottom 
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
        text: 'Text',
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
    const line = gMeme.lines.find(line => {
        return line.id === id;
    })
    return line
}


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

function setLineHeight(delta) {
    gMeme.lines[gMeme.selectedLineIdx].yLoc += delta
}

function updateKeywordCount(imgId) {

    const selectedImgKeyWords = gImgs.find(img => img.id === imgId).keywords
    selectedImgKeyWords.forEach(keyword => {
        if (!gKeywords[keyword]) {
            gKeywords[keyword] = 0
        }
        gKeywords[keyword]++
    })
}

function getKeywords() {
    return gKeywords
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
