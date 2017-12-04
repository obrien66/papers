var http = require("http")
var fs = require("fs")
var path = require("path")

http.createServer((req, res) => {
	if (req.method === "GET") {
		var url = req.url.replace(/%20/gi, " ")
		var filePath = path.join(__dirname, "../content", url)
		var parent = filePath.split("/").reverse()[1]
		fs.readdir(filePath, (err, files) => {
			if (err) {
				res.writeHead(404, "File not found", {"content-type": "text/html"})
				res.end(`<h1>404: File not found</h1><p><code>${url}</code> requested</p>${err.message}`)
			}
			else {
				res.writeHead(200, {"content-type": "text/html"})
				files = files.map(item => {
					return `<li><a href="${filePath.split("/").reverse()[0] + "/" + item}">${item}</a></li>`
				}).join("")

				var greet = req.url !== "/" ? url : "Homepage"
				res.write(`<h1>${greet}</h1>`)
				res.end(`<ul>${files}</ul>`)
			}
		});
	}
	else {
		res.writeHead(405, "Method not allowed", {"content-type": "text/html"})
		res.end("<h1>405: Method Not Allowed</h1>")
	}
}).listen(8000)
