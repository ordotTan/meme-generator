'use strict'


var gKeywords = {
    'politics': 2,
    'baby': 1,
    'animal': 3,
    'matrix': 4,
}

var gSearchText = ''

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['politics','trump','angry'] },
    { id: 2, url: 'img/2.jpg', keywords: ['animal','dog','cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['animal','dog','cute','baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['animal','cat','cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['baby','angry'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['baby','shock'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny'] },
    { id: 9, url: 'img/9.jpg', keywords: ['smile'] },
    { id: 10, url: 'img/10.jpg', keywords: ['politics','smile','obama'] },
    { id: 11, url: 'img/11.jpg', keywords: ['sport','kiss'] },
    { id: 12, url: 'img/12.jpg', keywords: ['celeb'] },
    { id: 13, url: 'img/13.jpg', keywords: ['celeb','cheers'] },
    { id: 14, url: 'img/14.jpg', keywords: ['matrix'] },
    { id: 15, url: 'img/15.jpg', keywords: ['sad'] },
    { id: 16, url: 'img/16.jpg', keywords: ['picard','laugh'] },
    { id: 17, url: 'img/17.jpg', keywords: ['politics','putin'] },
    { id: 18, url: 'img/18.jpg', keywords: ['toys'] },
    { id: 19, url: 'img/19.jpg', keywords: ['movie'] },
    { id: 20, url: 'img/20.jpg', keywords: ['animal','dog'] }
]


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