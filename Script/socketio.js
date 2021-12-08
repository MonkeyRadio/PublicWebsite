// const socket = io.connect('wss://server.nicojqn.ga:80', {
//     port: '80',
//     secure: true,
// });
const socket = io.connect('wss://cdn.monkeyradio.fr', {
    transports: ["websocket"],
    path: "/monkeysock"
});
socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});
audio = document.querySelector("audio");
audio.volume = 1;
radio = {};
arrayRadio = [];
radiolistening = {};
eventradios = {};
fav = 1;
radiosel = false;
hls = new Hls();
plyeditms = {};
incomming = {};
scroll = false;

socket.on('onair', function(msg) {
    data = msg;
    radio = data;
    arrayRadio.push(data)
    if (radiosel == false) {
        radiosel = true;
        radiolistening = radio;
        link = radiolistening["link"][0]
        document.querySelector(".btnplayerlarge").style.display = "block";
    }
});


socket.on('event', function(msg) {
    d = msg
    document.querySelector(".imglargeplayer").setAttribute("src", d["now"]["trackCover"])
    document.querySelector(".largeplayer-tit").innerHTML = d["now"]["trackTitle"]
    document.querySelector(".largeplayer-art").innerHTML = d["now"]["trackArtist"]
    eventradios = d
    document.querySelector(".player_cover").setAttribute("src", d["now"]["trackCover"])
    document.querySelector(".player_title").innerHTML = d["now"]["trackTitle"]
    document.querySelector(".player_artist").innerHTML = d["now"]["trackArtist"]

    var req = new XMLHttpRequest();
    req.open("GET", "https://cdn.monkeyradio.fr/api?incomming&plyed", false); // false for synchronous request
    req.send(null);
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

});

function epgprogress() {
    if (radiolistening != null) {
        if (eventradios["epg"] != null && JSON.stringify(eventradios["epg"]) != JSON.stringify({})) {

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

        } else {
            document.querySelector(".progress-bar").style.width = "100%"
            document.querySelector(".hours").style.display = "none";
            //document.querySelector("#titbp").style.top = "0px";
            document.querySelector(".bottomplayer").style.height = "85px";
        }
    }
    setTimeout(epgprogress, 100);
}
epgprogress()


function eventprogress() {
    eventPercent = 0;
    if (eventradios["now"] != null && radiolistening != null) {
        if (typeof(eventradios["now"]["trackTStart"]) != undefined) {

            now = Math.floor(Date.now() / 1000)
            if (eventradios["now"]["trackTdur"] != null) {
                s = eventradios["now"]["trackTStart"]
                d = eventradios["now"]["trackTDur"]
                eventPercent = ((Date.now() / 1000) - s) * 100 / d
            } else if (eventradios["now"]["trackTStop"] != null) {
                s = eventradios["now"]["trackTStart"]
                e = eventradios["now"]["trackTStop"]
                eventPercent = (((Date.now() / 1000) - s) * 100 / (e - s))
            }
            if (eventPercent < 0) {
                eventPercent = 0;
            }
            if (eventradios["now"]["trackTDur"] == null) {
                eventPercent = 0;
            }
            if (eventPercent > 100) {
                eventPercent = 100;
            }
            eventradios["now"]["percent"] = eventPercent;
            document.querySelector(".progress_event").style.width = eventPercent + "%"

        } else {
            document.querySelector(".progress_event").style.width = "0%"
        }
    }


    setTimeout(eventprogress, 1);
}
eventprogress()



function play() {
    if (audio.paused) {
        if (link["type"] == "mp3") {
            hls.destroy()
            audio.setAttribute("src", link["link"]);
            audio.play();
        } else if (link["type"] == "hls") {
            if (Hls.isSupported()) {
                hls.destroy()
                audio.setAttribute("src", "");
                hls = new Hls();
                hls.loadSource(link["link"]);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    audio.play();
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = link["link"];
                audio.addEventListener('loadedmetadata', function() {
                    audio.play();
                });
            }
        } else if (link["type"] == "rllhls") {
            if (Hls.isSupported()) {
                hls.destroy()
                audio.setAttribute("src", "");
                hls = new Hls({
                    "enableWorker": true,
                    "maxBufferLength": 1,
                    "liveBackBufferLength": 0,
                    "liveSyncDuration": 0,
                    "liveMaxLatencyDuration": 2,
                    "liveDurationInfinity": true,
                    "highBufferWatchdogPeriod": 1,
                });
                hls.loadSource(link["link"]);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    audio.play();
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = link["link"];
                audio.addEventListener('loadedmetadata', function() {
                    audio.play();
                });
            }
        }
        document.querySelectorAll(".play").forEach(e => {
            e.style.display = "none"
        });
        document.querySelectorAll(".stop").forEach(e => {
            e.style.display = "block"
        });
    } else {
        document.querySelectorAll(".play").forEach(e => {
            e.style.display = "block"
        });
        document.querySelectorAll(".stop").forEach(e => {
            e.style.display = "none"
        });
        audio.pause();
        hls.destroy();
        audio.setAttribute("src", "");
    }
}



function checkoffset() {
    if (window.pageYOffset >= 50) {
        document.querySelector(".bandeau").style.top = "-64px";
    } else {
        document.querySelector(".bandeau").style.top = "0px";
    }
    setTimeout(checkoffset, 10);
}
checkoffset();



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
            document.title = radiolistening["tit"] + " -> " + eventradios["now"]["trackTitle"] + " - " + eventradios["now"]["trackArtist"]
        } catch (e) {}
    } else {
        document.querySelector("#favicon").setAttribute("href", "assets/monkeyPNG.png");
        document.title = "Monkey";
    }
    setTimeout(displayFav, 100);
}

displayFav();



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