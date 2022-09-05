const devlog = new bootstrap.Modal(document.querySelector(".devLogger"));
const devlogz = new bootstrap.Modal(document.querySelector(".Logger"));
if (window.location.hostname == "www.dev.monkeyradio.fr") {
    window.onerror = function(message, url, lineNumber) {
        document.querySelector(".devloggerdiv").innerHTML = "<h6>Erreur JS " + url + " Ligne " + lineNumber + "</h6><br/><p>" + message + "</p>";
        devlog.toggle();
        return true;
    };

    eruda.init();

}

function log(a) {
    if (window.location.hostname == "www.dev.monkeyradio.fr") {
        console.log(a)
        document.querySelector(".devlogdiv").innerHTML += "<p>" + a + "</p>";
        devlogz.toggle();
    } else if (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1") {
        console.log(a)
    }
}