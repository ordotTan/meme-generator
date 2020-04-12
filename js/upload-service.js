
// on submit call to this function
function onUploadImg(elForm, ev) {
    ev.preventDefault();
    renderMeme(true)
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log (uploadedImgUrl)
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        const href = `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}"`
        setTimeout(function(){ window.open(href, '_blank'); }, 3000);
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}


