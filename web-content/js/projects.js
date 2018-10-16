function projectsInit() {
    retrieveAndParseData("project_entries", function(data) {
        var entryIndex = 0;

        var rowImageWidth = 0;
        var rowImageHeight = 0;

        var firstBrElement = document.getElementById("content_wrapper").children[0];

        for (let dataIndex = 0; dataIndex < data.length; dataIndex += 3) {
            var title = data[dataIndex];
            var text = data[dataIndex + 1];
            var imageSource = data[dataIndex + 2];

            var entryDiv = document.createElement("div");
            entryDiv.id = "entry" + entryIndex;
            entryDiv.style.width = "20%";
            
            if (entryIndex < 3) {
                entryDiv.style.marginTop = "2%";
            } else {
                entryDiv.style.marginTop = "1%";
            }

            entryDiv.style.display = "inline-block";
            entryDiv.style.float = "left";

            var titleDiv = document.createElement("div");
            var titleDivSpan = document.createElement("span");

            titleDiv.id = "entry" + entryIndex + "_title";
            titleDiv.classList.add("news_entry_title");
            titleDiv.classList.add("no_select");
            titleDiv.classList.add("header_font");
            
            titleDivSpan.innerHTML = title;
            titleDivSpan.onmouseover = function(event) {
                event.path[0].style.color = "grey";
            };
            titleDivSpan.onmouseleave = function(event) {
                event.path[0].style.color = "black";
            };		
            titleDivSpan.onmousedown = function(event) {
                //Since this is the span inside of the titleDiv you
                // have you go back two parent elements to get to the entry div
                var entryDiv = event.path[0].parentElement.parentElement;

                var title = entryDiv.children[1].innerText;
                var text = entryDiv.children[2].innerHTML;
                var imageSrc = entryDiv.children[0].children[0].src;

                setUpArticlePage(entryDiv.id, title, imageSrc, text);
            };
            titleDiv.appendChild(titleDivSpan);

            var textDiv = document.createElement("div");
            textDiv.id = "entry" + entryIndex + "_text";
            textDiv.classList.add("news_entry_text");
            textDiv.classList.add("body_text");
            textDiv.classList.add("body_text_font");
            textDiv.innerHTML = text;
            textDiv.style.overflow = "hidden";
            textDiv.style.width = 0;
            textDiv.style.height = 0;

            var imageDiv = document.createElement("div");
            imageDiv.id = "entry" + entryIndex + "_image";
            var imageDivImg = document.createElement("img");

            imageDivImg.onload = function() {
                var imageDiv = this.parentElement;
                var entryDiv = imageDiv.parentElement;
                imageDiv.style.width = "100%";
                this.style.width = "100%";
                this.style.height = "auto";

                var thisImageComputedStype = window.getComputedStyle(this);
                var imageHeight = styleStringtoInt(thisImageComputedStype.getPropertyValue("height"), false);
                var imageWidth = styleStringtoInt(thisImageComputedStype.getPropertyValue("width"));
                const titleDiv = document.getElementById(entryDiv.id + "_title");
                const titleDivSpan = titleDiv.children[0];

                var entryIndex = getEntryNumer(entryDiv.id) + 1;
                var remainder = entryIndex % 3;

                entryDiv.style.marginRight = "2%";

                if (remainder == 1) {
                    entryDiv.style.marginLeft = "17%";
                    
                    rowImageWidth = imageWidth;
                    rowImageHeight = imageHeight;
                } else {
                    imageWidth = rowImageWidth;
                    imageHeight = rowImageHeight;
                    this.style.width = imageWidth + "px";
                    this.style.height = imageHeight + "px";
                    
                    if (remainder == 0) {
                        document.createElement("br").appendAfter(entryDiv);
                        rowDivTop += rowImageHeight;
                    }
                }

                imageDiv.parentElement.style.height = imageHeight + "px";
                titleDivSpan.style.fontSize = (window.innerHeight * .03) + "px";
                var titleDivHeight = ((window.innerHeight * .03) * 1.5);
                titleDiv.style.height = titleDivHeight + "px";
                titleDiv.style.width = imageWidth + "px";
                entryDiv.style.height = (titleDivHeight + imageHeight) + "px";
            };
            imageDivImg.src = imageSource;
            imageDiv.appendChild(imageDivImg);

            entryDiv.appendChild(imageDiv);
            entryDiv.appendChild(titleDiv);
            entryDiv.appendChild(textDiv);

            var contentWrapper = document.getElementById("content_wrapper");
            contentWrapper.insertBefore(entryDiv, firstBrElement);
            lastElement = entryDiv;

            if ((entryIndex % 3) == 0 &&
                (entryIndex > 0)) {
                contentWrapper.appendChild(document.createElement("br"));
            }

            ++entryIndex;
        }
    });
}