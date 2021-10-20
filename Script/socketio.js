const socket = io("wss://server.nicojqn.ga:10604");
audio=document.querySelector("audio");
audio.volume=1;
radios={};
arrayRadio=[];
radiolistening={};
eventradios={};
link={};
fav=1;
radisel=false;
hls = new Hls();


socket.on('radios', function(msg){
  data=JSON.parse(msg);
  data.forEach(e => {
    if(e["id"]==12){
    radios[e["id"]]=e;
    arrayRadio.push(e)
}
});
});


socket.on('event', function(msg){
  d=JSON.parse(msg)
  if(d["radio"]["id"]==12){
  document.querySelector(".imglargeplayer").setAttribute("src",d["now"]["cov"])
  document.querySelector(".largeplayer-tit").innerHTML=d["now"]["tit"]
  document.querySelector(".largeplayer-art").innerHTML=d["now"]["art"]
  eventradios[d["radio"]["id"]]=d
  document.querySelector(".player_cover").setAttribute("src",d["now"]["cov"])
  document.querySelector(".player_title").innerHTML=d["now"]["tit"]
  document.querySelector(".player_artist").innerHTML=d["now"]["art"]
  if(radisel==false){
    radiosel=true;
    id=12
    radiolistening=radios[id];
    document.querySelector("#LinkSelect").innerHTML=""
    link["list"]={}
    index=0
    for (const [key, value] of Object.entries(radiolistening["listLink"])) {
        document.querySelector("#LinkSelect").innerHTML+="<option>"+value["name"]+"</option>"
        value["index"]=index
        link["list"][value["name"]]=value;
        index+=1;
    }
    if(getCookie("link_"+radiolistening["id"])!=null && radiolistening["listLink"][getCookie("link_"+radiolistening["id"])] != undefined){
        document.querySelector("#LinkSelect").selectedIndex=getCookie("link_"+radiolistening["id"])
        //setPlayer(link["list"][getCookie("link_"+radiolistening["id"])])
    }else{
    setPlayer(radiolistening["listLink"][0]);
    }
    document.querySelector(".btnplayerlarge").style.display="block";
  }
  }
});

function epgprogress(){
  if(radiolistening["id"]!=null){
  if(eventradios[radiolistening["id"]]["epg"]!=null){

    now=Math.floor(Date.now() / 1000)
    start=eventradios[radiolistening["id"]]["epg"]["start"]
    stop=eventradios[radiolistening["id"]]["epg"]["stop"]
    epgPercent=(now - start ) *100 / (stop - start) 
    eventradios[radiolistening["id"]]["epg"]["percent"]=epgPercent;
    document.querySelector(".progress-bar").style.width=epgPercent+"%"
    document.querySelector(".hours").style.display="block";
    document.querySelector("#titbp").style.top="42px";
    document.querySelector(".bottomplayer").style.height="110px";
   
textstart= new Date(eventradios[radiolistening["id"]]["epg"]["start"]*1000);
textstop= new Date(eventradios[radiolistening["id"]]["epg"]["stop"]* 1000)
startTime=("0" + textstart.getHours()).slice(-2)+"h"+("0" + textstart.getMinutes()).slice(-2) 
stopTime=("0" + textstop.getHours()).slice(-2)+"h"+("0" + textstop.getMinutes()).slice(-2)
if(startTime!=document.querySelector(".epgstart").innerHTML) document.querySelector(".epgstart").innerHTML=startTime;
if(stopTime!=document.querySelector(".epgstop").innerHTML) document.querySelector(".epgstop").innerHTML=stopTime;
if(eventradios[radiolistening["id"]]["epg"]["tit"]!=document.querySelector(".epgtit").innerHTML) document.querySelector(".epgtit").innerHTML=eventradios[radiolistening["id"]]["epg"]["tit"];

    }else{
      document.querySelector(".progress-bar").style.width="100%"
      document.querySelector(".hours").style.display="none";
      document.querySelector("#titbp").style.top="20px";
      document.querySelector(".bottomplayer").style.height="85px";
    }
  }
    setTimeout(epgprogress,100);
}
epgprogress()


function eventprogress(){
    eventPercent=0;
  if(radiolistening["id"]!=null){
  if(eventradios[radiolistening["id"]]["now"]["start"]!=null){

    now=Math.floor(Date.now() / 1000)
    if(eventradios[radiolistening["id"]]["now"]["dur"]!=null){
      s=eventradios[radiolistening["id"]]["now"]["start"]
      d=eventradios[radiolistening["id"]]["now"]["dur"]
      eventPercent=((Date.now()/1000)-s)*100/d
    }else if(eventradios[radiolistening["id"]]["now"]["end"]!=null){
      s=eventradios[radiolistening["id"]]["now"]["start"]
      e=eventradios[radiolistening["id"]]["now"]["end"]
      eventPercent=(((Date.now()/1000)-s)*100/(e-s))
    }
    if(eventPercent<0){
      eventPercent=0;
    }
    if(eventradios[radiolistening["id"]]["now"]["dur"]==null){
        eventPercent=0;
    }
    if(eventPercent>100){
        eventPercent=100;
      }
    eventradios[radiolistening["id"]]["now"]["percent"]=eventPercent;
    document.querySelector(".progress_event").style.width=eventPercent+"%"

    }else{
      document.querySelector(".progress_event").style.width="0%"
    }
  }


    setTimeout(eventprogress,1);
}
eventprogress()


function checkprogress(){
    arrayRadio.forEach(e=>{
        
        if(eventradios[e["id"]]!=null && eventradios[e["id"]]["now"]["dur"]!=null && eventradios[e["id"]]["now"]["start"]+eventradios[e["id"]]["now"]["dur"]<=Date.now()/1000){
            // Si Titre Terminé
            if(eventradios[e["id"]]["epg"]!=null){
               eventradios[e["id"]]["now"]["tit"]=eventradios[e["id"]]["epg"]["tit"]
               eventradios[e["id"]]["now"]["art"]=eventradios[e["id"]]["radio"]["tit"]
               eventradios[e["id"]]["now"]["cov"]=eventradios[e["id"]]["epg"]["cov"]
               eventradios[e["id"]]["now"]["start"]=Math.floor(Date.now()/1000)-5;
               eventradios[e["id"]]["now"]["dur"]=null
            }else{
                eventradios[e["id"]]["now"]["tit"]=eventradios[e["id"]]["radio"]["tit"]
                eventradios[e["id"]]["now"]["art"]=eventradios[e["id"]]["radio"]["msg"]
                eventradios[e["id"]]["now"]["cov"]=eventradios[e["id"]]["radio"]["cov"]
                eventradios[e["id"]]["now"]["start"]=Math.floor(Date.now()/1000)-5;
                eventradios[e["id"]]["now"]["dur"]=null
            }
            document.querySelector(".imglargeplayer").setAttribute("src",eventradios[e["id"]]["now"]["cov"])
            document.querySelector(".largeplayer-tit").innerHTML=eventradios[e["id"]]["now"]["tit"]
            document.querySelector(".largeplayer-art").innerHTML=eventradios[e["id"]]["now"]["art"]
            if(radiolistening["id"]!=null && e["id"]==radiolistening["id"]){
            document.querySelector(".player_cover").setAttribute("src",eventradios[e["id"]]["now"]["cov"])
            document.querySelector(".player_title").innerHTML=eventradios[e["id"]]["now"]["tit"]
            document.querySelector(".player_artist").innerHTML=eventradios[e["id"]]["now"]["art"]
            }
         }
    })
    setTimeout(checkprogress,100);
}

checkprogress()



function setPlayer(a){

  link["now"]=a

}


oldlink="undefined";

    function veriflink() {
      if(radiolistening["id"]+document.querySelector("#LinkSelect").value != oldlink){
          a=document.querySelector("#LinkSelect").value
          setPlayer(link["list"][a])
          play();
          play();
          oldlink=radiolistening["id"]+document.querySelector("#LinkSelect").value;
          setCookie("link_"+radiolistening["id"],link["now"]["index"])
      }
      setTimeout( () => { veriflink() } ,100);
      }
      
      veriflink();



      function play(){
        if(audio.paused){
          if(link["now"]["type"]=="mp3"){
            hls.destroy()
            dash.destroy()
            audio.setAttribute("src",link["now"]["link"]);
            audio.play();
            }else if(link["now"]["type"]=="hls"){
            if(Hls.isSupported()) {
              hls.destroy()
              audio.setAttribute("src","");
              hls = new Hls();
              hls.loadSource(link["now"]["link"]);
              hls.attachMedia(audio);
              hls.on(Hls.Events.MANIFEST_PARSED,function() {
                audio.play();
            });
            }else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
              audio.src = link["now"]["link"];
              audio.addEventListener('loadedmetadata', function () {
                audio.play();
              });
          }
            }else if(link["now"]["type"]=="rllhls"){
              if(Hls.isSupported()) {
                hls.destroy()
                audio.setAttribute("src","");
                hls = new Hls({
                  "enableWorker": true,
                  "maxBufferLength": 1,
                  "liveBackBufferLength": 0,
                  "liveSyncDuration": 0,
                  "liveMaxLatencyDuration": 2,
                  "liveDurationInfinity": true,
                  "highBufferWatchdogPeriod": 1,
                  });
                hls.loadSource(link["now"]["link"]);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                  audio.play();
              });
              }else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = link["now"]["link"];
                audio.addEventListener('loadedmetadata', function () {
                  audio.play();
                });
            }
              }
            document.querySelector(".play").style.display="none";
            document.querySelector(".stop").style.display="block";
        }else{
          document.querySelector(".play").style.display="block";
          document.querySelector(".stop").style.display="none";
          audio.pause();
          hls.destroy();
          audio.setAttribute("src","");
        }
      }



function checkoffset(){
  if(window.pageYOffset>=50){
    document.querySelector(".bandeau").style.top="-64px";
  }else{
    document.querySelector(".bandeau").style.top="0px";
  }
  setTimeout(checkoffset,10);
}
checkoffset();



function bplayer(a){
  if(a==true){
    document.querySelector(".bottomplayer").style.bottom="0px";
    document.querySelector(".player-bfix").style.display="block";
  }else{
    document.querySelector(".bottomplayer").style.bottom="-110px";
    document.querySelector(".player-bfix").style.display="none";
  }
  
}



function displayFav(){
  if(fav==1){
    try{
      document.querySelector("#favicon").setAttribute("href",eventradios[radiolistening["id"]]["now"]["cov"]);
      document.title=radiolistening["tit"]+" -> "+eventradios[radiolistening["id"]]["now"]["tit"]+" - "+eventradios[radiolistening["id"]]["now"]["art"]
    }catch(e){}
    }else{
    document.querySelector("#favicon").setAttribute("href","assets/monkeyPNG.png");
    document.title="MonkeyRadio";
  }
  setTimeout(displayFav,100);
}

displayFav();



function checkplay(){
  if(audio.paused){
    audio.pause()
    hls.destroy()
    audio.setAttribute("src","");
    document.querySelector(".play").style.display="block";
    document.querySelector(".stop").style.display="none";
  }
  setTimeout(checkplay,100)
}

checkplay()


//Déclaration de fonction de cookies



function setCookie(sName, sValue) {
  var today = new Date(), expires = new Date();
  expires.setTime(today.getTime() + (365*24*60*60*1000));
  document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}
function DelCookie(sName) {
  var today = new Date(), expires = new Date();
  expires.setTime(today.getTime() - (1));
  document.cookie = sName + "=" + encodeURIComponent('DELETED') + ";expires=" + expires.toGMTString();
}
function  getCookie(name){
if(document.cookie.length == 0)
 return null;

var regSepCookie = new RegExp('(; )', 'g');
var cookies = document.cookie.split(regSepCookie);

for(var i = 0; i < cookies.length; i++){
 var regInfo = new RegExp('=', 'g');
 var infos = cookies[i].split(regInfo);
 if(infos[0] == name){
   return unescape(infos[1]);
 }
}
return null;
}
