'use strict'

var gKeywords = {
    'happy': 12,
    'sad': 3,
    'funny': 8
}

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'img/2.jpg', keywords: ['sad'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny'] }
]

var gMeme = {
    selectedImgID: 1,
    selectedLineIdx: 0,
    maxId: 1,
    lines: [
        {
            lineID: 1,
            x:0,
            y:0,
            text: 'bla',
            alignType: 'center',
            color: 'black',
            fontSize: 30
        }
    ]
}

function getImages() {
    return gImgs
}

function setMeme(imgId) {
    gMeme.selectedImgID = imgId
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


function clearCurrMeme() {
    gMeme.lines = []
    addLine()
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
            y = (gCanvas.height-65) / 2; // middle
            break;
    }
    const line = {
        id: lineId,
        index: gMeme.lines.length,
        height: y,
        text: '',
        alignType: 'center',
        color: 'black',
        fontSize: 30
    }
    gMeme.selectedLineIdx=gMeme.lines.length
    gMeme.lines.push(line)
}


function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.lines.forEach((line,idx) => { // giving new indexes after line was removed
        line.index=idx   
    })
    gMeme.selectedLineIdx=0

}

function getLineByID(id) {
    const line = gMeme.lines.find(line => {
        return line.id === id;
    })
    return line
}


function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx>gMeme.lines.length-1) gMeme.selectedLineIdx=0
    return gMeme.lines[gMeme.selectedLineIdx]
}

