'use strict'

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    resizeCanvas() //to open correctly for desktop v.s mobile
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.saved-memes-container').style.display = 'none';
    gCtx = gCanvas.getContext('2d');
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


function onNavMenu(elLink) {
    handleLinks(elLink)
    switch (elLink.innerText) {
        case 'Gallery':
            navClick('none',false,'none')
            break
        case 'Editor':
            navClick('none',true,'flex')
            break
        case 'Saved Memes':
            navClick('block',true,'none')
            renderStoredMemes()
            break
        case 'About':
            navClick('none',false,'none')
    }
    if (window.innerWidth < 740) onToggleHamburger()
}

function navClick(savedMemes, gallery, editor) {
    document.querySelector('.saved-memes-container').style.display = savedMemes
    document.querySelector('.images-container').hidden = gallery
    document.querySelector('.meme-editor').style.display = editor
}

function handleLinks(elLink) { // to set the correct "active" class on the clicked item
    const links = document.querySelectorAll('.main-nav li')
    links.forEach(link => link.classList.remove('active'))
    elLink.parentNode.classList.add('active')
}

function onToggleHamburger() {
    document.body.classList.toggle('menu-open')
}