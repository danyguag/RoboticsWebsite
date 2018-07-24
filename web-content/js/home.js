function getLineHeight(element){
    var lineHeight = parseInt(window.getComputedStyle(element).getPropertyValue("line-height"), 10);
    var clone;
    var singleLineHeight;
    var doubleLineHeight;

    if (isNaN(lineHeight)) {
        clone = element.cloneNode();
        clone.innerHTML = '<br>';
        element.appendChild(clone);
        singleLineHeight = clone.offsetHeight;
        clone.innerHTML = '<br><br>';
        doubleLineHeight = clone.offsetHeight;
        element.removeChild(clone);
        lineHeight = doubleLineHeight - singleLineHeight;
    }

    return lineHeight;
 }

function homeInit() {
    retrieveAndParseData("news_entries", function(dataArray) {
        var newsElement = document.getElementById("news");
        var entryIndex = 0;

        for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex += 3) {
            var title = dataArray[dataIndex];
            var text = dataArray[dataIndex + 1];
            var imageSource = dataArray[dataIndex + 2];

            var entryDiv = document.createElement("div");
            entryDiv.id = "entry" + entryIndex;
            entryDiv.style.width = "100%";

            var titleDiv = document.createElement("div");
            titleDiv.id = "entry" + entryIndex + "_title";
            titleDiv.classList.add("news_entry_title");
            titleDiv.classList.add("no_select");
            titleDiv.classList.add("header_font");
            var titleDivSpan = document.createElement("span");
            titleDivSpan.innerHTML = title;
            
            titleDivSpan.onmouseover = function(event) {
                var element = event.path[0];

                element.style.color = "grey";
            };
            titleDivSpan.onmouseleave = function(event) {
                var element = event.path[0];

                element.style.color = "black";
            };
            titleDivSpan.onmousedown = function(event) {
                //Since this is the span inside of the titleDiv you
                // have you go back two parent elements to get to the entry div
                var entryDiv = event.path[0].parentElement.parentElement;

                var title = entryDiv.children[0].innerText;
                var text = entryDiv.children[1].innerText;
                var imageSrc = entryDiv.children[2].children[0].src;

                setUpArticlePage(entryDiv.id, title, imageSrc, text);

            };

            titleDiv.appendChild(titleDivSpan);

            var textDiv = document.createElement("div");
            textDiv.id = "entry" + entryIndex + "_text";
            textDiv.classList.add("news_entry_text");
            textDiv.classList.add("body_text");
            textDiv.innerHTML = text;

            var imageDiv = document.createElement("div");
            imageDiv.id = "entry" + entryIndex + "_image";
            imageDiv.classList.add("news_entry_image");
            var imageDivImg = document.createElement("img");
            imageDivImg.onload = function() {
                var entryDiv = this.parentElement.parentElement;

                var titleDiv = document.getElementById(entryDiv.id + "_title");
                var titleDivSpan = titleDiv.children[0];
                titleDivSpan.style.fontSize = (window.innerHeight * .03) + "px";
                titleDiv.style.height = ((window.innerHeight * .03) * 1.5) + "px";
                var titleDivRect = titleDivSpan.getBoundingClientRect();
                var width = titleDivRect.right - titleDivRect.left;

                if ((width / window.innerWidth) < .214) {
                    width = percentageToPX("width", "20%");
                }

                titleDiv.style.width = width + "px";
                this.style.width = width + "px";
        
                var titleDivComputedStyle = window.getComputedStyle(titleDiv);
        
                titleDiv.style.marginLeft = percentageToPX("width", "20%") + "px";

                var leftMargin = styleStringtoInt(titleDivComputedStyle.getPropertyValue("margin-left"), true);

                var textDiv = document.getElementById(entryDiv.id + "_text");
                
                var textDivComputedStyle = window.getComputedStyle(textDiv);

                var maxWidth = styleStringtoInt(textDivComputedStyle.getPropertyValue("max-width"), true);

                var titleHeight = window.getComputedStyle(titleDiv).getPropertyValue("height");
                var leftPadding = percentageToPX("width", "2%");
                textDiv.style.marginRight = (window.innerWidth - (leftMargin + width + leftPadding + maxWidth)) + "px";
                textDiv.style.top = titleHeight;
                var lineHeight = getLineHeight(textDiv);

                var imageHeight =   styleStringtoInt(window.getComputedStyle(this).getPropertyValue("height"), false);

                var lines = Math.floor(imageHeight / lineHeight);
                console.log("lines: " + lines);
                textDiv.style.height = lines* lineHeight + "px";

                textDiv.style.maxHeight = imageHeight + "px";

                imageHeight += styleStringtoInt(titleHeight, false);

                entryDiv.style.height = imageHeight + "px";
            };
            imageDivImg.src = imageSource;
            imageDiv.appendChild(imageDivImg);

            entryDiv.appendChild(titleDiv);
            entryDiv.appendChild(textDiv);
            entryDiv.appendChild(imageDiv);

            entryDiv.style.width = "100%";
            entryDiv.style.height = textDiv.style.maxHeight;

            newsElement.appendChild(entryDiv);
            newsElement.appendChild(document.createElement("br"));

            ++entryIndex;
        }
    });
}