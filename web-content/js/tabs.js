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
		navWidth += (navChildSpan.offsetWidth + minMargin);

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

	nav.style.width = (navWidth + percentageToPX("width", "2%")) + "px";

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