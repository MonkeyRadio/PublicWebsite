const devlog = new bootstrap.Modal(document.querySelector(".devLogger"));
if(window.location.hostname=="www.dev.monkeyradio.fr"){
window.onerror = function(message, url, lineNumber) {  
    document.querySelector(".devloggerdiv").innerHTML="<h6>Erreur JS Ligne "+lineNumber+"</h6><br/><p>"+message+"</p>";
    devlog.toggle();
    return true;
  };  

}