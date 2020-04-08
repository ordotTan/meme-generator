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
    selectedImgID:1,
    selectedLineIdx:0,
    lines: [
        {
            lineID: 1,
            text:'bla',
            align:'c',
            color:'black'
        }
    ]
}

function getImages() {
    return gImgs
}

function setMeme(imgId) {
    gMeme.selectedImgID=imgId
}

function getMeme() {
    return gMeme
}

function getMemeLines() {
    return gMeme.lines
}


function updateMemeLine(text) {
    gMeme.lines[gMeme.selectedLineIdx].text = text
}
