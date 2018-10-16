window.callScriptInitCalls = [];
window.tabsHtml = [];

Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
},false;

Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
},false;

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
				if (nextAddition != '\n') {
					dataArray.push(nextAddition);
					startIndex = dataIndex = dataIndex + 5;
				}
				if (data[startIndex] == '\n') {
					++startIndex;
				}
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

				if (currentRule.selectorText == ".body_text_font") {
					currentRule.style.fontSize = (window.innerHeight * .01656314699826087) + "px";
				}
				if (currentRule.selectorText == ".header_style") {
					currentRule.style.fontSize = (window.innerHeight * 0.0236616385688571) + "px";
				}
			}
		}
	}
};

var getEntryNumer = function(entryID) {
	return parseInt(entryID.substring("entry".length));
}

var getElementBySibling = function(base, type) {
	var result = base.nextSibling;
	while (true) {
        if (result.nodeName == type) {
            return result;
        } else {
            result = result.nextSibling;
        }
    }
}

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
