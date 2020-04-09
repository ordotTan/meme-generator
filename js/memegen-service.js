'use strict'

var gKeywords = {
    'happy': 12,
    'sad': 3,
    'funny': 8
}

var gSearchText = ''

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['happy','sad'] },
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
    var img = img.keywords.some (word => word.startsWith(gSearchText))
    return img
  }

function setSearchText(searchText) {
    gSearchText = searchText
}

function setMeme(imgId) {
    gMeme.selectedImgID = imgId
    gMeme.selectedLineIdx = 0
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
    switch (gMeme.lines.length) {  //for the box location... 
        case 0:  //top 
            y = 10;
            break;
        case 1:
            y = gCanvas.height - 60    //bottom 
            break;
        default:
            y = (gCanvas.height - 65) / 2; // middle
            break;
    }
    const line = {
        id: lineId,
        index: gMeme.lines.length,
        height: y,
        text: 'Your text goes here',
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
    gMeme.lines[gMeme.selectedLineIdx].height += delta
}


function setLineHeightKeyboard(ev, delta) {
    if (ev.key === "ArrowDown")
        gMeme.lines[gMeme.selectedLineIdx].height += delta
    else if (ev.key === "ArrowUp")
        gMeme.lines[gMeme.selectedLineIdx].height -= delta

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
