var getTierPosition = function(tierPlacementInfo, tierLetter) {
    var placement = tierPlacementInfo[tierLetter];
    var nextPlacement = placement + 1
    if (nextPlacement > 2) {
        nextPlacement = 0;
    }
    tierPlacementInfo[tierLetter] = nextPlacement;
    return placement;
}

function sponsorsInit() {
    retrieveAndParseData("sponsors", function(data) {

        var tierPlacementInfo = {
            'e' : 0,
            'd' : 0,
            'p' : 0,
            'g' : 0,
            's' : 0,
            'b' : 0            
        };

        for (let dataIndex = 0; dataIndex < data.length; dataIndex += 3) {
            var tierElement = document.getElementById(data[dataIndex] + "tier");
            var displayType = data[dataIndex + 1];
            var src = data[dataIndex + 2];

            if (displayType == "text") {
                var sponsorElement = document.createElement("span");

                sponsorElement.innerHTML = src;
                sponsorElement.classList.add("sponsor");
                sponsorElement.style.fontSize = percentageToPX("height", "4%") + "px";
                tierElement.appendChild(sponsorElement);

                var position = getTierPosition(tierPlacementInfo, data[dataIndex]);
                var shouldInsertLine = false;

                if (position == 0) {
                    sponsorElement.style.cssFloat = "left";
                } else if (position == 1) {
                    var halfTextWidth = styleStringtoInt(getComputedStyle(sponsorElement).getPropertyValue("width"), true) / 2;
                    var halfWindowWidth = percentageToPX("width", "50%");
                    var previousElementStyle = getComputedStyle(sponsorElement.previousSibling);
                    var previousTotalWidth = styleStringtoInt(previousElementStyle.getPropertyValue("width"), true) + styleStringtoInt(previousElementStyle.getPropertyValue("margin-left"), true);
                    
                    var pixelsFromPrevToCenter = halfWindowWidth - previousTotalWidth;

                    console.log("halfWindowWidth: " + halfWindowWidth);
                    console.log("halfTextWidth: " + halfTextWidth);
                    console.log(halfWindowWidth - halfTextWidth);

                    sponsorElement.style.marginLeft = (pixelsFromPrevToCenter - halfTextWidth) + "px";
                } else if (position == 2) {
                    sponsorElement.style.cssFloat = "right";
                    sponsorElement.style.marginLeft = "0px";
                    sponsorElement.style.marginRight = "10%";
                    shouldInsertLine = true;
                }
                
                if (shouldInsertLine) {
                    tierElement.appendChild(document.createElement("br"));
                }
            }

            //Picture needs to be loaded in

        }

        document.getElementById("etier").appendChild(document.createElement("br"));
        document.getElementById("dtier").appendChild(document.createElement("br"));
        document.getElementById("ptier").appendChild(document.createElement("br"));
        document.getElementById("gtier").appendChild(document.createElement("br"));
        document.getElementById("stier").appendChild(document.createElement("br"));
        document.getElementById("btier").appendChild(document.createElement("br"));

    });    
}