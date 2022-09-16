function saveTheme(){
    localStorage.setItem('darktheme', vuetify.$vuetify.theme.dark);

    // Load StyleSheet that correspond to the theme

    if(vuetify.$vuetify.theme.dark) document.getElementById("ColorModeSheet").setAttribute("href", "style/Dark.css"); else document.getElementById("ColorModeSheet").setAttribute("href", "style/Light.css");

}

document.addEventListener("VueLoadAPI",()=>{
    darktheme=localStorage.getItem("darktheme");
    if(darktheme==null) darktheme=true;
    vuetify.$vuetify.theme.dark= (darktheme === "true" || darktheme === true);
    saveTheme();
});