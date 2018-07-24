window.callScriptInitCalls = [];
window.tabsHtml = [];

var getTabElementByName = function(tabName) {
	var navChildren = document.getElementById("nav").children;

	for (let childIndex = 0; childIndex < navChildren.length; ++childIndex) {
		const child = navChildren[childIndex];
		var childAttributes = child.attributes[0];

		if (childAttributes.nodeValue == tabName) {
			return child; 
		}
	}

	return null;
};

var getActiveTabElement = function() {
	var navChildren = document.getElementById("nav").children;

	for (let elementIndex = 0; elementIndex < navChildren.length; elementIndex++) {
		const navChild = navChildren[elementIndex];
		if (navChild.classList.contains("active")) {
			return navChild;
		}
	}
};

var changeActiveTabElement = function(newTabName) {
	const previouslyActiveElement = getActiveTabElement();
	const newActiveTab = getTabElementByName(newTabName);
	
	if (newActiveTab == null) {
		return;
	} else {
		if (previouslyActiveElement != null) {
			previouslyActiveElement.classList.remove("active");
		}
	}
	
	newActiveTab.classList.add("active");

	var rect = newActiveTab.getClientRects()[0];
	
	const activeTabBlur = document.getElementById("active_tab_blur");
	activeTabBlur.style.visibility = "visible";
	activeTabBlur.style.top = rect.top + "px";
	activeTabBlur.style.bottom = rect.bottom + "px";
	activeTabBlur.style.left = rect.left + "px";
	activeTabBlur.style.right = rect.right + "px";
	activeTabBlur.style.width = rect.width + "px";
	activeTabBlur.style.height = rect.height + "px";

	if (newActiveTab.innerText == "HOME") {
		document.getElementById("home_title").children[0].innerText = "STEALTH TIGER";
		document.getElementById("home_title").children[2].innerText = "ROBOTICS";
		document.getElementById("home_title").style.textAlign = "center";
		
	} else {
		document.getElementById("home_title").children[0].innerText = newActiveTab.innerText;
		document.getElementById("home_title").children[2].innerText = "";
		document.getElementById("home_title").style.textAlign = "left";
		document.getElementById("home_title").style.marginLeft = "5%";
	}
};

var tabMouseOverEvent = function(event) {
	var li = event.path[0];

	if (li.classList.contains("active")) {
		return;
	}

	li.classList.add("hover");

	var rect = li.getClientRects()[0];
	
	const hoverTabBlur = document.getElementById("hover_tab_blur");
	hoverTabBlur.style.visibility = "visible";
	hoverTabBlur.style.top = rect.top + "px";
	hoverTabBlur.style.right = rect.right + "px";
	hoverTabBlur.style.bottom = rect.bottom + "px";
	hoverTabBlur.style.left = rect.left + "px";
	hoverTabBlur.style.width = rect.width + "px";
	hoverTabBlur.style.height = rect.height + "px";

	// hoverTabBlur.style.clip = "rect(" + hoverTabBlur.style.top + "," + hoverTabBlur.style.right + "," + hoverTabBlur.style.bottom + "," + hoverTabBlur.style.left + ")";

};

var tabMouseOutEvent = function(event) {
	var li = event.path[0];
	li.classList.remove("hover");
	const hoverTabBlur = document.getElementById("hover_tab_blur");
	hoverTabBlur.style.visibility = "hidden";
};

var setDocumentTitles = function() {
	const activeTab = getActiveTabElement();
	var uppercaseFirstLetter = activeTab.innerText.charAt(0).toUpperCase();
	document.title = uppercaseFirstLetter + activeTab.innerText.toLowerCase().substring(1);

	var headerNameSpan = document.getElementById("header_name");
	console.log(activeTab.innerHTML);
	if (activeTab.children[0].innerHTML == "HOME") {
		headerNameSpan.innerHTML = "TEAM 3164";
	} else {
		headerNameSpan.innerHTML = "STEALTHTIGERS";
	}
};

var switchTab = function(tabName, isFirstCall) {
	changeActiveTabElement(tabName);
	document.location.hash = tabName.toLowerCase();
	setDocumentTitles();

	if (isFirstCall) {
		window.backgroundImageHeight = null;
	}

	//This is so that the hover blur doesnt blend with the active blur until another tab is moused over
	const hoverTabBlur = document.getElementById("hover_tab_blur");
	hoverTabBlur.style.visibility = "hidden";
	hoverTabBlur.style.url = "url(" + tabName + ".jpg"

	const contentWrapper = document.getElementById("content_wrapper");

	var tabsHtml = window.tabsHtml;
	var set = false;

	for (let index = 0; index < tabsHtml.length; ++index) {
		const currentTab = tabsHtml[index];

		if (currentTab.name == tabName) {
			contentWrapper.innerHTML = currentTab.html;

			var functionName = tabName + "Init";
			try {
				var tabFunction = eval(functionName);
				tabFunction();
			} catch(err) {
				window.callScriptInitCalls.push(tabName);
			}
			set = true;
		}
	}

	if (!set) {
		var req = new XMLHttpRequest();
		req.addEventListener("load", function(){
			var newTab = {
				name: tabName,
				html: this.responseText
			};
			window.tabsHtml.push(newTab);
			contentWrapper.innerHTML = this.responseText;
			var functionName = tabName + "Init";
			try {
				var tabFunction = eval(functionName);
				tabFunction();
			} catch(err) {
				window.callScriptInitCalls.push(tabName);
			}
		
		});
		req.open("GET", "/" + tabName + ".html");
		req.send();
	}

	var background = document.getElementById("background_image_blur");
	background.style.backgroundImage = "url(" + tabName + ".jpg";

	var acbackground = document.getElementById("active_tab_blur");
	acbackground.style.backgroundImage = "url(" + tabName + ".jpg";

	var htbackground = document.getElementById("hover_tab_blur");
	htbackground.style.backgroundImage = "url(" + tabName + ".jpg";

	var img = new Image();
	img.onload = function() {
		const contentWrapper = document.getElementById("content_wrapper");
		if (isFirstCall) {
			window.backgroundImageHeight = "73%";
		}
		background.style.width = "100vw";
		background.style.height = window.backgroundImageHeight;

		contentWrapper.style.top = percentageToPX("height", window.backgroundImageHeight) + "px";
	};
	img.src = tabName + '.jpg';
};

var tabMouseOnClickEvent = function(event) {
	var clickedElement = event.currentTarget;
	var tabName = clickedElement.attributes[0].nodeValue;
	switchTab(tabName, false);
};

var getTabNameFromSrc = function(src) {
	var endIndex = src.length - 3;
	for (let index = src.length - 3; 0 < index; --index) {
		var currentChar = src[index];

		if (currentChar == '/') {
			var result = src.substring(index + 1, endIndex)
			return result; 
		}
	}
	return src;
}

var setupTabs = function() {
	var homeTitle = document.getElementById("home_title");
	homeTitle.style.fontSize = percentageToPX("height", "7.5%") + "px";

	var nav = document.getElementById("nav");
	var navChildren = nav.children;

	var navWidth = 0;
	nav.style.width = percentageToPX("width", "50%") + "px";

	var minMargin = window.innerWidth * 0.022265625;

	for (let liIndex = 0; liIndex < navChildren.length; ++liIndex) {
		const navChild = navChildren[liIndex];
		const navChildSpan = navChild.children[0];
		
		navChild.style.width = (percentageToPX("width", "50%") / navChildren.length) + "px";
		navChild.style.width = (navChildSpan.offsetWidth + minMargin) + "px";
		console.log(navChild.localName + ":" + navChild.style.width);
		navWidth += navChild.scrollWidth;

		navChild.onmouseover = tabMouseOverEvent;
		navChild.onmouseout = tabMouseOutEvent;
		navChild.onclick = tabMouseOnClickEvent;

		var scriptName = "js/" + navChild.attributes[0].nodeValue  + ".js";
		var script = document.createElement("script"); // Make a script DOM node
	    script.src = scriptName; // Set it's src to the provided URL

		script.onload = function() {
			var name = getTabNameFromSrc(this.src);

			for (let index = 0; index < window.callScriptInitCalls.length; ++index) {
				var current = window.callScriptInitCalls[index];

				if (name == current) {
					var functionName = current + "Init";
					eval(functionName)();
					window.callScriptInitCalls.splice(window.callScriptInitCalls.indexOf(current), 1);
				}
			}
		}

    	document.head.appendChild(script);
	}

	nav.style.width = navWidth + "px";

	var wrapperChildren = document.getElementById("wrapper").children;

	var header = document.getElementById("header").children[0];

	var hrTop = window.getComputedStyle(header).getPropertyValue("height");

	if (hrTop == "0px") {
		header.onload = function() {
			for (let index = 0; index < wrapperChildren.length; ++index) {
				const wrapperChild = wrapperChildren[index];
		
				if (wrapperChild.localName == "hr") {
					wrapperChild.style.top = window.getComputedStyle(document.getElementById("header").children[0]).getPropertyValue("height");
				}
			}
		};
	} else {
		for (let index = 0; index < wrapperChildren.length; ++index) {
			const wrapperChild = wrapperChildren[index];
	
			if (wrapperChild.localName == "hr") {
				wrapperChild.style.top = hrTop;
			}
		}
	} 
};

var endsWith = function(src, end) {
	if (src.length < end.length) {
		return false;
	}
	for (var i = src.length - 1; i >= (src.length - end.length); i--) {
		if (src[i] != end[i - (src.length - end.length)]) {
			return false;
		}
	}
	return true;
};

var startsWith = function(src, start) {
	for (let index = 0; index < start.length; ++index) {
		if (src[index] != start[index]) {
			return false;
		}
	}

	return true;
};

var styleStringtoInt = function(styleString, width) {
	if (endsWith(styleString, "px")) {
		return parseInt(styleString.substring(0, styleString.length - 2));
	} else if (endsWith(styleString, "%")) {
		var percent = parseInt(styleString.substring(0, styleString.length - 1)) / 100;
		var whole = window.innerHeight;
		if (width) {
			whole = window.innerWidth;
		}

		return whole * percent;
	}
	return NaN;
};

var percentageToPX = function(axis, percentage) {
	var percent = parseInt(percentage.substring(0, percentage.length - 1)) / 100;
	var whole = window.innerHeight;
	if (axis == "width") {
		whole = window.innerWidth;
	}

	return whole * percent;
}

//NOTE: It is important that the data file starts with ";;;;;"
var retrieveAndParseData = function(fileName, callback) {
	// "data_file", function(data) {
	
	var req = new XMLHttpRequest();
	req.addEventListener("load", function(){
		var data = this.responseText;
		var dataArray = [];

		if (!data.startsWith(";;;;;")) {
			alert("data_file is corrupted");
			return;
		}
		var startIndex = 5;
		var dataIndex = 5;
	
		while (true) {
			var currentCheck = data.substring(dataIndex, dataIndex + 5);
	
			if (currentCheck == (";;;;;")) {
				var nextAddition = data.substring(startIndex, dataIndex);
				dataArray.push(nextAddition);
				startIndex = dataIndex = dataIndex + 5;
			} else {
				dataIndex += 1;
			}
	
			if (dataIndex >= data.length) {
				break;
			}
		}

		callback(dataArray);
	});
	req.open("GET", "/" + fileName + ".data");
	req.send();
};

var setBodyTextFontSize = function() {
	const styleSheets = document.styleSheets;

	for (let styleSheetIndex = 0; styleSheetIndex < styleSheets.length; ++styleSheetIndex) {
		const currentStyleSheet = styleSheets[styleSheetIndex];

		if (endsWith(currentStyleSheet.href, "main.css")) {
			const rules = currentStyleSheet.rules;

			for (let ruleIndex = 0; ruleIndex < rules.length; ++ruleIndex) {
				const currentRule = rules[ruleIndex];

				if (currentRule.selectorText == ".body_text") {
					currentRule.style.fontSize = (window.innerHeight * .01656314699826087) + "px";
				}
				if (currentRule.selectorText == ".header_style") {
					currentRule.style.fontSize = (window.innerHeight * 0.0236616385688571) + "px";
				}
			}
		}
	}
};

var setUpDevelopmentOutreach =  function(data) {
	var entryIndex = 0;

	for (let dataIndex = 0; dataIndex < data.length; dataIndex += 3) {
		var title = data[dataIndex];
		var text = data[dataIndex + 1];
		var imageSource = data[dataIndex + 2];

		var entryDiv = document.createElement("div");
		entryDiv.id = "entry" + entryIndex;
		entryDiv.style.width = "100%";
		entryDiv.style.marginTop = "2%";

		var titleDiv = document.createElement("div");
		titleDiv.id = "entry" + entryIndex + "_title";
		titleDiv.classList.add("news_entry_title");
		titleDiv.classList.add("no_select");
		titleDiv.style.verticalAlign = "middle";
		titleDiv.style.position = "relative";
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
		titleDiv.appendChild(titleDivSpan);

		titleDivSpan.onmousedown = function(event) {
			//Since this is the span inside of the titleDiv you
			// have you go back two parent elements to get to the entry div
			var entryDiv = event.path[0].parentElement.parentElement;

			var title = entryDiv.children[1].innerText;
			var text = entryDiv.children[2].innerHTML;
			console.log(text);
			var imageSrc = entryDiv.children[0].children[0].src;

			setUpArticlePage(entryDiv.id, title, imageSrc, text);
		};

		var textDiv = document.createElement("div");
		textDiv.id = "entry" + entryIndex + "_text";
		textDiv.classList.add("news_entry_text");
		textDiv.classList.add("body_text");
		textDiv.innerHTML = text;
		textDiv.style.visibility = "hidden";

		var imageDiv = document.createElement("div");
		imageDiv.id = "entry" + entryIndex + "_image";
		imageDiv.classList.add("news_entry_image");
		var imageDivImg = document.createElement("img");
		imageDivImg.onload = function() {
			var imageDiv = this.parentElement;
			imageDiv.style.width = "20%";
			this.style.width = "100%";
			this.style.height = "auto";

			var imageHeight = styleStringtoInt(window.getComputedStyle(this).getPropertyValue("height"), false);
			imageDiv.parentElement.style.height = imageHeight + "px";

			var titleDiv = document.getElementById(entryDiv.id + "_title");
			var titleDivSpan = titleDiv.children[0];
			titleDivSpan.style.fontSize = (window.innerHeight * .03) + "px";
			titleDiv.style.height = ((window.innerHeight * .03) * 1.5) + "px";
			var titleDivRect = titleDivSpan.getBoundingClientRect();
			
			titleDiv.style.top = ((this.height / 2) - titleDivRect.height) + "px";

			console.log("wtf" + titleDiv.style.top);
		};
		imageDivImg.src = imageSource;
		imageDiv.appendChild(imageDivImg);

		entryDiv.appendChild(imageDiv);
		entryDiv.appendChild(titleDiv);
		entryDiv.appendChild(textDiv);

		var contentWrapper = document.getElementById("content_wrapper");
		contentWrapper.appendChild(entryDiv);
		contentWrapper.appendChild(document.createElement("br"));

		++entryIndex;
	}
}

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
	textDiv.classList.add("center");
	textDiv.style.marginLeft = "30%";
	textDiv.style.maxWidth = "40%";
	textDiv.style.width = "100%";
	textDiv.innerHTML = text;

	var mainContainer = document.createElement("div");
	mainContainer.id = articleID;
	mainContainer.appendChild(titleDiv);
	mainContainer.appendChild(imageDiv);
	mainContainer.appendChild(textDiv);

	var contentWrapper = document.getElementById("content_wrapper");
	contentWrapper.innerHTML = "";
	contentWrapper.appendChild(mainContainer);
};

window.onresize = function() {
	setBodyTextFontSize();

	setupTabs();

	switchTab(getActiveTabElement().attributes[0].nodeValue, true);
};

$(window).ready(function()
{
	setBodyTextFontSize();

	setupTabs();

	switchTab("home", true);
});
