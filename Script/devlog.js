const devlog = new bootstrap.Modal(document.querySelector(".devLogger"));
const devlogz = new bootstrap.Modal(document.querySelector(".Logger"));
if(window.location.hostname=="www.dev.monkeyradio.fr"){
window.onerror = function(message, url, lineNumber) {  
    document.querySelector(".devloggerdiv").innerHTML="<h6>Erreur JS "+url+" Ligne "+lineNumber+"</h6><br/><p>"+message+"</p>";
    devlog.toggle();
    return true;
  };  

}

function log(a){
    if(window.location.hostname=="www.dev.monkeyradio.fr"){
    document.querySelector(".devlogdiv").innerHTML+="<p>"+a+"</p>";
    devlogz.toggle();
    }
}
