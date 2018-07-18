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
	// activeTabBlur.style.clip = rect;

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
	hoverTabBlur.style.bottom = rect.bottom + "px";
	hoverTabBlur.style.left = rect.left + "px";
	hoverTabBlur.style.right = rect.right + "px";
	hoverTabBlur.style.width = rect.width + "px";
	hoverTabBlur.style.height = rect.height + "px";
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
	if (activeTab.innerHTML == "HOME") {
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

	var navChildren = document.getElementById("nav").children;

	for (let liIndex = 0; liIndex < navChildren.length; ++liIndex) {
		const navChild = navChildren[liIndex];

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
