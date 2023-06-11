cdnURL = "https://cdn.monkeyradio.fr/";

let socket;
audio = document.querySelector("audio");
audio.volume = 1;
radio = {};
arrayRadio = [];
radiolistening = {};
eventradios = {};
eventradiosSock = {};
fav = 1;
radiosel = false;
plyeditms = {};
incomming = {};
scroll = false;
link = []
id3tag = false;
eventElapsed = 0;

SocketURL = "";
SocketDir = "";
BasicAPIURL = "";

const loadingModalIt = {
    modal: new bootstrap.Modal(document.querySelector(".listen-loading")),
    value: false,
    show : function () {
        this.value = true;
        setTimeout(() => {
            if (this.value)
                this.modal.show();
        }, 1000);
    },
    hide: function () {
        this.value = false;
        this.modal.hide();
        setTimeout(() => {
            if (!this.value)
            this.modal.hide();
        }, 500);
    }
}

loadingModalIt.show();

var reqsocket = new XMLHttpRequest();
reqsocket.open("GET", cdnURL + "?request=Service/Socket-API/0", true);

reqsocket.onload = function () {

    SocketURL = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceURL"];
    SocketDir = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceDir"];

    var reqbasic = new XMLHttpRequest();
    reqbasic.open("GET", cdnURL + "?request=Service/Basic-API/0", true);

    reqbasic.onload = function(){

    BasicAPIURL = JSON.parse(reqbasic.responseText)["ServiceAccessList"][0]["ServiceURL"];

    socket = io.connect(SocketURL, {
        transports: ["websocket"],
        path: SocketDir
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });


    socket.on('onair', function (msg) {
        data = msg;
        radio = data;
        arrayRadio.push(data)
        if (radiosel == false) {
            radiosel = true;
            radiolistening = radio;
            document.querySelector("#favicon").setAttribute("href", radio["cover"]);
            document.querySelectorAll(".WebDisTit").forEach(e => { e.innerHTML = radio["WebDisTit"] })
            document.querySelector("title").innerHTML = radio["WebDisTit"];
            document.querySelectorAll(".iconRounded").forEach(element => {
                element.setAttribute("src", radio["cover"])
            });;
            document.querySelector(".imglargeplayer").setAttribute("src", radio["cover"]);
            link.push({ "link": radio["DiffLinkPath"], "type": radio["DiffLinkType"] });
            setTimeout(() => {
                document.querySelector(".btnplayerlarge").style.display = "block";
                document.querySelector(".btnplayermini").style.display = "block";
            }, 500);
            loadingModalIt.hide();
        }
    });

    socket.on('event', function (d) {
        eventradiosSock = d;
        eventradiosSock["now"]["provider"] = "sock";
        eventradiosSock["epg"]["provider"] = "sock";

        if (id3tag == false) {
            eventradios = JSON.parse(JSON.stringify(eventradiosSock));
            eventElapsed = 0;
            setTimeout(trignewEvent, 100);
        }


        var req = new XMLHttpRequest();
        req.open("GET", BasicAPIURL + "?incomming=" + eventradiosSock["now"]["late"] + "&plyed");
        req.send();

        req.onload = function () {

            req = JSON.parse(req.responseText);

            //Update Playlist
            plist = document.querySelector(".plist-timeline");
            plist.innerHTML = ""
            a = 0
            for (let e of req["playedItms"]) {
                var date = new Date(e["trackTStart"] * 1000);
                // Hours part from the timestamp
                var hours = ("0" + date.getHours()).slice(-2);
                // Minutes part from the timestamp
                var minutes = ("0" + date.getMinutes()).slice(-2);
                plist.insertAdjacentHTML("afterbegin", `
        <li class="timeline-item success list-group-item-warning">
        <div class="margin-left-15">
            <img class="imgtimeline" src="` + e["trackCover"] + `" />
            <p style="position: absolute; left: 90px; top:0px;" class="text-truncate">
                <span class="text-muted text-small text-truncate">
                    ` + hours + ":" + minutes + `
                </span><br/>
                <a class="text-truncate">
                    ` + e["trackArtist"] + `
                </a> <br/> <span class="text-truncate"> ` + e["trackTitle"] + `</span>
            </p>
        </div>
    </li>
    `)
                if (a == 35) {
                    break
                }
                a += 1
            }
            var date = new Date(d["now"]["trackTStart"] * 1000);
            // Hours part from the timestamp
            var hours = ("0" + date.getHours()).slice(-2);
            // Minutes part from the timestamp
            var minutes = ("0" + date.getMinutes()).slice(-2);
            plist.innerHTML += `
    <li class="timeline-item success list-group-item-warning timeline-now">
    <div class="margin-left-15">
        <img class="imgtimeline" src="` + d["now"]["trackCover"] + `" />
        <p style="position: absolute; left: 90px; top:0px;" class="text-truncate">
            <span class="text-muted text-small text-truncate">
                ` + hours + ":" + minutes + `
            </span><br/>
            <a class="text-truncate">
                ` + d["now"]["trackArtist"] + `
            </a> <br/><span class="text-truncate"> ` + d["now"]["trackTitle"] + `</span>
        </p>
    </div>
</li>
`;

            a = 0
            for (let e of req["IncommingItems"]) {
                var date = new Date(e["trackTStart"] * 1000);
                // Hours part from the timestamp
                var hours = ("0" + date.getHours()).slice(-2);
                // Minutes part from the timestamp
                var minutes = ("0" + date.getMinutes()).slice(-2);
                plist.innerHTML += `
        <li class="timeline-item success list-group-item-warning">
        <div class="margin-left-15">
            <img class="imgtimeline" src="` + e["trackCover"] + `" />
            <p style="position: absolute; left: 90px; top:0px;" class="text-truncate">
                <span class="text-muted text-small text-truncate">
                    ` + hours + ":" + minutes + `
                </span><br/>
                <a class="text-truncate">
                    ` + e["trackArtist"] + `
                </a> <br/> <span class="text-truncate"> ` + e["trackTitle"] + `</span>
            </p>
        </div>
    </li>
    `
                if (a == 35) {
                    break
                }
                a += 1
            }

            if (scroll == false) {
                scroll = true;
                setTimeout(() => { document.querySelector('#playlistbdiv').scrollTop = document.querySelector('.timeline-now').offsetTop - 300 }, 500);
            }

        }

    });



    epgprogress()
    eventprogress()
    checkoffset();
    displayFav();
    bpm();

    }

    reqbasic.send();

}


reqsocket.send();


function trignewEvent() {
    if (eventradios["now"]["trackCover"] != document.querySelector(".imglargeplayer").getAttribute("src")
        || eventradios["now"]["trackTitle"] != document.querySelector(".largeplayer-tit").innerHTML
        || eventradios["now"]["trackArtist"] != document.querySelector(".largeplayer-art").innerHTML) {
        document.querySelector(".imglargeplayer").setAttribute("src", eventradios["now"]["trackCover"])
        document.querySelector(".largeplayer-tit").innerHTML = eventradios["now"]["trackTitle"]
        document.querySelector(".largeplayer-art").innerHTML = eventradios["now"]["trackArtist"]
        document.querySelector(".player_cover").setAttribute("src", eventradios["now"]["trackCover"])
        document.querySelector(".player_title").innerHTML = eventradios["now"]["trackTitle"]
        document.querySelector(".player_artist").innerHTML = eventradios["now"]["trackArtist"]
        if (listening)
            updateMediaSession(eventradios.now.trackTitle, eventradios.now.trackArtist, "MonkeyRadio", eventradios.now.trackCover);
    }
}


function epgprogress() {
    if (radiolistening != null) {
        if (eventradios["epg"] != null && JSON.stringify(eventradios["epg"]) != JSON.stringify({})) {

            try {

                now = Math.floor(Date.now() / 1000)
                start = eventradios["epg"]["start"]
                stop = eventradios["epg"]["stop"]
                epgPercent = (now - start) * 100 / (stop - start)
                eventradios["epg"]["percent"] = epgPercent;
                document.querySelector(".progress-bar").style.width = epgPercent + "%"
                document.querySelector(".hours").style.display = "block";
                // document.querySelector("#titbp").style.top = "42px";

                textstart = new Date(eventradios["epg"]["start"] * 1000);
                textstop = new Date(eventradios["epg"]["stop"] * 1000)
                startTime = ("0" + textstart.getHours()).slice(-2) + "h" + ("0" + textstart.getMinutes()).slice(-2)
                stopTime = ("0" + textstop.getHours()).slice(-2) + "h" + ("0" + textstop.getMinutes()).slice(-2)
                if (startTime != document.querySelector(".epgstart").innerHTML) document.querySelector(".epgstart").innerHTML = startTime;
                if (stopTime != document.querySelector(".epgstop").innerHTML) document.querySelector(".epgstop").innerHTML = stopTime;
                if (eventradios["epg"]["tit"] != document.querySelector(".epgtit").innerHTML) document.querySelector(".epgtit").innerHTML = eventradios["epg"]["tit"];

            } catch (e) { }

        } else {
            try {
                document.querySelector(".progress-bar").style.width = "100%"
                document.querySelector(".hours").style.display = "none";
                //document.querySelector("#titbp").style.top = "0px";
                document.querySelector(".bottomplayer").style.height = "85px";
            } catch (e) { }
        }
    }
    setTimeout(epgprogress, 100);
}



function eventprogress() {
    eventPercent = 0;
    if (eventradios["now"] != null && radiolistening != null) {
        if (typeof (eventradios["now"]["trackTStart"]) != undefined && id3tag == true && eventradios["now"]["Type"] != "MediaMask") {
            document.querySelector(".pbar").style.opacity = 1;

            now = Math.floor(Date.now() / 1000)
            if (eventradios["now"]["trackTDur"] != null) {
                s = eventradios["now"]["trackTStart"]
                d = eventradios["now"]["trackTDur"]
                eventPercent = eventElapsed * 100 / d
            }
            if (eventPercent <= 0) {
                eventPercent = 0;
                document.querySelector(".pbar").style.opacity = 0;
            }
            if (eventradios["now"]["trackTDur"] == null) {
                eventPercent = 0;
            }
            if (eventPercent > 100) {
                eventPercent = 100;
            }
            eventradios["now"]["percent"] = eventPercent;
            document.querySelector(".progress_event").style.width = eventPercent + "%"
            document.querySelector(".pbarfill").style.width = eventPercent + "%"

        } else {
            document.querySelector(".pbar").style.opacity = 0;
            document.querySelector(".progress_event").style.width = "0%"
            document.querySelector(".pbarfill").style.width = "0%"
        }
    }


    setTimeout(eventprogress, 1);
}



function checkoffset() {
    if (window.pageYOffset >= 50) {
        document.querySelector(".bandeau").style.top = "-64px";
    } else {
        document.querySelector(".bandeau").style.top = "0px";
    }
    setTimeout(checkoffset, 10);
}




function bplayer(a) {
    if (a == true) {
        document.querySelector(".bottomplayer").style.bottom = "0px";
        document.querySelector(".player-bfix").style.display = "block";
    } else {
        document.querySelector(".bottomplayer").style.bottom = "-110px";
        document.querySelector(".player-bfix").style.display = "none";
    }

}



function displayFav() {
    if (fav == 1) {
        try {
            // document.querySelector("#favicon").setAttribute("href", eventradios["now"]["trackCover"]);
            document.title = radio["smallTit"] + " -> " + eventradios["now"]["trackTitle"] + " - " + eventradios["now"]["trackArtist"]
        } catch (e) { }
    } else {
        document.querySelector("#favicon").setAttribute("href", "assets/monkeyPNG.png");
        document.title = "Monkey";
    }
    setTimeout(displayFav, 100);
}



//Déclaration de fonction de cookies



function setCookie(sName, sValue) {
    var today = new Date(),
        expires = new Date();
    expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}

function DelCookie(sName) {
    var today = new Date(),
        expires = new Date();
    expires.setTime(today.getTime() - (1));
    document.cookie = sName + "=" + encodeURIComponent('DELETED') + ";expires=" + expires.toGMTString();
}

function getCookie(name) {
    if (document.cookie.length == 0)
        return null;

    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);

    for (var i = 0; i < cookies.length; i++) {
        var regInfo = new RegExp('=', 'g');
        var infos = cookies[i].split(regInfo);
        if (infos[0] == name) {
            return unescape(infos[1]);
        }
    }
    return null;
}


function bpm() {
    eventElapsed += 0.013;
    setTimeout(bpm, 10)
}
