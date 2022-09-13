function mute(s = null) {
    if (s == null) {
        if (audio.muted) {
            audio.muted = false;
            document.querySelector(".vmuted").style.display = "none";
            document.querySelector(".vhigh").style.display = "block";
        } else {
            audio.muted = true;
            document.querySelector(".vmuted").style.display = "block";
            document.querySelector(".vhigh").style.display = "none";
        }
    } else if (s == true) {
        audio.muted = true;
        document.querySelector(".vmuted").style.display = "block";
        document.querySelector(".vhigh").style.display = "none";
    } else if (s == false) {
        audio.muted = false;
        document.querySelector(".vmuted").style.display = "none";
        document.querySelector(".vhigh").style.display = "block";
    }
}

document.querySelector(".vrange").oninput = function () {
    audio.volume = document.querySelector(".vrange").value;
    localStorage.setItem("monkeyVol", document.querySelector(".vrange").value);
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("monkeyVol") != undefined) {
        audio.volume = parseFloat(localStorage.getItem("monkeyVol"));
        document.querySelector(".vrange").value = parseFloat(localStorage.getItem("monkeyVol"));
    }
})