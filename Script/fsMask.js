const fsB = (n = null) =>  {
    if(n == true){
        document.querySelector('.fsBottom').style.bottom = "0px";
    }else{
        document.querySelector('.fsBottom').style.bottom = "-65px";
    }
}


const fsWa = () => {
    if(document.querySelector("audio").paused){
        vuetify.fsPlayer.playButton = "mdi-play";
    }else{
        vuetify.fsPlayer.playButton = "mdi-pause";
    }

    setTimeout(fsWa,50);
}


document.addEventListener("VueLoadAPI", () => {
    fsWa();

    document.querySelector(".fsPlayButton").addEventListener("click", () =>{
        if(document.querySelector("audio").paused){
            document.querySelector("audio").play()
        }else{
            document.querySelector("audio").pause();
        }
    })
})