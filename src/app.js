var http = require("http")
var fs = require("fs")
var path = require("path")
var config = require("./pref")

var server = http.createServer((req, res) => {
	if (req.method === "GET") {
		var url = req.url.replace(/%20/gi, " ")

		var filePath = path.join(__dirname, "../" + config.content, url.replace(config.serverdir, ""))

		if (filePath.split(".").reverse()[0] !== "pdf") {
			fs.readdir(filePath, (err, files) => {
				if (err) {
					res.writeHead(404, "File not found", {"content-type": "text/html"})
					res.end(`<h1>404: File not found</h1><p><code>${url}</code> requested</p>${err.message}</p><a href="/">home page</a>`)
				}
				else {
					res.writeHead(200, {"content-type": "text/html"})
					var parent = filePath.split("/").reverse()[1]
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
			fs.readFile(filePath, (err, data) => {
				if (err) {
					res.writeHead(404, "File not found", {"content-type": "text/html"})
					res.end(`<h1>404: File not found</h1><p><code>${url}</code> requested</p>${err.message}</p><a href="/">home page</a>`)
				}
				else {
					res.writeHead(200, {"content-type": "application.pdf"})
					res.end(data)
				}
			})
		}

	}
	else {
		res.writeHead(405, "Method not allowed", {"content-type": "text/html"})
		res.end("<h1>405: Method Not Allowed</h1>")
	}
})
console.log("http://localhost:"+ config.port)
server.listen(config.port)
