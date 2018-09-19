var http = require('http');
var fileSystem = require('fs');

var sendHtmlFile = function(res, name) {
	fileSystem.readFile("web-content/html" + name, {encoding: 'utf-8' }, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'text/html' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
};

var sendJSFile = function(res, name) {
	fileSystem.readFile("web-content" + name, {encoding: 'utf-8' }, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'text/js' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
};

var sendCSSFile = function(res, name) {
	fileSystem.readFile("web-content" + name, {encoding: 'utf-8' }, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'text/css' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
};

var sendPNGFile = function(res, name) {
	fileSystem.readFile("web-content/pictures" + name, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'image/png' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
}

var sendJPEGFile = function(res, name) {
	fileSystem.readFile("web-content/pictures" + name, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'image/jpeg' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
};

var sendDataFile = function(res, name) {
	fileSystem.readFile("web-content/data" + name, function(err,data){
	    if (!err){
		    res.writeHead(200, {'Content-Type': 'text/plain' });
		    res.write(data);
		    res.end();		    	
	    }else{
	        console.log(err);
	    }
	});
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

http.createServer(function (req, res) {
	try {
		if (endsWith(req.url, ".html")) {
			sendHtmlFile(res, req.url);
		} else if (endsWith(req.url, ".css")) {
			sendCSSFile(res, req.url);
		} else if (endsWith(req.url, ".js")) {
			sendJSFile(res, req.url);
		} else if (endsWith(req.url, ".jpg")) {
			sendJPEGFile(res, req.url);
		} else if (endsWith(req.url, ".png")) {
			sendPNGFile(res, req.url);
		} else if (endsWith(req.url, ".data")) {
			sendDataFile(res, req.url);
		} else {
			if (req.url == "/") {
				sendHtmlFile(res, "/index.html");
				return;
			} else if (req.url == "/favicon.ico") {
				sendPNGFile(res, "/header/logo.png");
				return;
			} else {
				console.log("req.url: " + req.url);
				return;
			}
		}
	} catch(err) {
		console.log(err);
	}
}).listen(80, "localhost");