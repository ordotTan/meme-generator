'use strict'

function renderGallery() {
    const images = getImages()
    var strHtmls
    if (images.length === 0) {
        strHtmls = '<img style="margin:auto; width:300px;margin:15px" src="img/no_images.png">'
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


//render all keywords, after "more" is clicked
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

function renderFirstKeywords() { // Render first 3 keywords, with "more...""
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


function onSearchGallery(elInput) {
    document.querySelector('.images-content').innerHTML = '';
    setSearchText(elInput.value)
    renderGallery()
}