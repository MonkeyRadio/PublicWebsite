function bplayer(a){
    if(a==true){
      document.querySelector(".bottomplayer").style.bottom="0px";
      document.querySelector(".player-bfix").style.display="block";
    }else{
      document.querySelector(".bottomplayer").style.bottom="-110px";
      document.querySelector(".player-bfix").style.display="none";
    }
    
  }