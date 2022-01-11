addEventListener("load", () => {
    styleAll(".embed", "none")
    document.querySelector("#playerbdiv").style.display = "block";

    var elems = document.querySelectorAll(".navitem");
    var index = 0,
        length = elems.length;
    for (; index < length; index++) {
        elems[index].addEventListener("click", (e) => {
            styleAll(".embed", "none")
            try{
            document.querySelector("#" + e.target.id + "div").style.display = "block";
            }catch(a){
                console.log(e)
            }
            if (e.target.id == "playlistb") document.querySelector('#playlistbdiv> #overf').scrollTop = document.querySelector('.timeline-now').offsetTop - 300;
            if (e.target.id == "playerb") {
                bplayer(false)
            } else {
                bplayer(true)
            }
        })

    }

})

function styleAll(sel, dis) {
    var elems = document.querySelectorAll(sel);
    var index = 0,
        length = elems.length;
    for (; index < length; index++) {
        elems[index].style.display = dis;
    }
}