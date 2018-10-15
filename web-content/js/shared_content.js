var setUpArticlePage = function(articleID, title, imageSrc, text) {
	var titleDiv = document.createElement("div");
	titleDiv.id = articleID + "_title";
	titleDiv.classList.add("center_title_text");
	titleDiv.classList.add("no_select");
	titleDiv.classList.add("header_font");
	var titleDivSpan = document.createElement("span");
	titleDivSpan.innerHTML = title;
	titleDiv.appendChild(titleDivSpan);

	var imageDiv = document.createElement("div");
	imageDiv.id = articleID + "_image";
	imageDiv.style.textAlign = "center";
	var imageDivImg = document.createElement("img");
	imageDivImg.onload = function() {
		var imageWidth = percentageToPX("width", "40%");
		imageDivImg.style.width = imageWidth + "px";
		imageDivImg.style.height = "auto";
	};
	imageDivImg.src = imageSrc;
	imageDiv.appendChild(imageDivImg);
	
	var textDiv = document.createElement("div");
	textDiv.id = articleID + "_text";
	textDiv.classList.add("body_text");
	textDiv.classList.add("body_text_font");
	textDiv.classList.add("center");
	textDiv.style.marginLeft = "30%";
	textDiv.style.maxWidth = "40%";
	textDiv.style.width = "100%";
	var realText = text + "<br><br><br>";
	textDiv.innerHTML = realText;

	var mainContainer = document.createElement("div");
	mainContainer.id = articleID;
	mainContainer.appendChild(titleDiv);
	mainContainer.appendChild(imageDiv);
	mainContainer.appendChild(textDiv);

	var contentWrapper = document.getElementById("content_wrapper");
	contentWrapper.innerHTML = "";
	contentWrapper.appendChild(mainContainer);
};