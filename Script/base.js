
cdnURL = "https://cdn.monkeyradio.fr/";


SocketURL = "";
SocketDir = "";
BasicAPIURL = "";

document.addEventListener("VueLoadAPI", () => {
    var reqsocket = new XMLHttpRequest();
    reqsocket.open("GET", cdnURL + "?request=Service/Socket-API/0", true);

    reqsocket.onload = function () {

        SocketURL = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceURL"];
        SocketDir = JSON.parse(reqsocket.responseText)["ServiceAccessList"][0]["ServiceDir"];

        var reqbasic = new XMLHttpRequest();
        reqbasic.open("GET", cdnURL + "?request=Service/Basic-API/0", true);

        reqbasic.onload = function () {

            BasicAPIURL = JSON.parse(reqbasic.responseText)["ServiceAccessList"][0]["ServiceURL"];

            socket = io.connect(SocketURL, {
                transports: ["websocket"],
                path: SocketDir
            });



            socket.on('onair', function (msg) {
                data = msg;



                // Initialisation Complete

                document.querySelector(".loadingSplash").style.opacity = 0;
                setTimeout(() => { document.querySelector(".loadingSplash").style.display = "none"; }, 300)
                document.querySelector("#app").style.display = "";

            });



            socket.on('event', function (d) {

                vuetify.radioEvents.now = d.now

                vuetify.radioEvents.epg = d.epg

            })





        }
        reqbasic.send();

    }


    reqsocket.send();



})



