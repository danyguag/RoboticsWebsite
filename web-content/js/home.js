function entryNameToEntryNumber(entryName) {
    return parseInt(entryName.substring("entry".length));
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
            var titleDivSpan = document.createElement("span");
            titleDivSpan.innerHTML = title;
            titleDiv.appendChild(titleDivSpan);

            var textDiv = document.createElement("div");
            textDiv.id = "entry" + entryIndex + "_text";
            textDiv.classList.add("news_entry_text");
            textDiv.innerHTML = text;

            var imageDiv = document.createElement("div");
            imageDiv.id = "entry" + entryIndex + "_image";
            imageDiv.classList.add("news_entry_image");
            var imageDivImg = document.createElement("img");
            imageDivImg.onload = function() {
                var entryDiv = this.parentElement.parentElement;

                var titleDiv = document.getElementById(entryDiv.id + "_title");
                var titleDivSpan = titleDiv.children[0];
                titleDivSpan.style.fontSize = (window.innerHeight * .05) + "px";
                titleDivSpan.style.height = "auto";
                var rect = titleDivSpan.getBoundingClientRect();
                var width = rect.right - rect.left;

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
        
                var leftPadding = percentageToPX("width", "2%");
                textDiv.style.marginRight = (window.innerWidth - (leftMargin + width + leftPadding + maxWidth)) + "px";
                textDiv.style.paddingTop = "2vh";

                var imageHeight =   styleStringtoInt(window.getComputedStyle(this).getPropertyValue("height"), false) + 
                                    styleStringtoInt(window.getComputedStyle(titleDiv).getPropertyValue("height"), false);

                textDiv.style.maxHeight = imageHeight + "px";

                entryDiv.style.height = textDiv.style.maxHeight;
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