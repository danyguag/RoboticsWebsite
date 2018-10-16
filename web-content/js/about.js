function aboutInit() {
    var teamImage = getElementBySibling(document.getElementById("about_team_title"), "IMG");

    teamImage.onload = function() {
        var teamImage = this;
        teamImage.style.marginLeft = percentageToPX("width", "10%") + "px";
        teamImage.style.width = percentageToPX("width", "40%") + "px";

        var teamBio = document.createElement("div");
        teamBio.classList.add("news_entry_text");
        teamBio.classList.add("body_text");
        teamBio.classList.add("body_text_font");
        teamBio.innerHTML = "Our FRC team 3164 Stealth Tigers is a Tampa, Florida located team that formed in 2010. We are a collaboration between Jesuit High School and Academy of the Holy Names. Students from both schools come together to construct a robot that is reflective of this shared interest, resulting in total team inclusion where every student has contributed to the robot in some way. Our design process is very open and respective of the entire team\'s views for how to best compete in the game, and our building process is rigorous but incredibly exhilarating due to the team\'s dynamic and motivation to succeed."
        
        teamBio.style.marginRight = "10%";
        teamBio.style.maxWidth = "35%";

        var teamImageHeight = styleStringtoInt(window.getComputedStyle(teamImage).getPropertyValue("height")); 

        teamBio.style.marginTop = ((teamImageHeight / 2) - (teamImageHeight / 5)) + "px";

        teamBio.appendAfter(teamImage);
    }
}