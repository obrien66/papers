var http = require("http")
var fs = require("fs")
var path = require("path")
// Get config file
var config = require("./pref")

// Start server
var server = http.createServer((req, res) => {
	// Get stylesheet
	var styles = fs.readFileSync(__dirname + "/master.css", "utf8").replace(/\n|\t/g, "")
	// if get request
	if (req.method === "GET") {
		var replaceVal = new RegExp(config.content + "|/" + config.serverdir)
		console.log(replaceVal)
		var url = req.url.replace(/%20/gi, "\ ").replace(replaceVal, "")
		var filePath = path.join(__dirname, "../" + config.content, url)
		if (filePath.split(".").reverse()[0] !== "pdf") {
			console.log("shouldnt be pdf " + url)
			fs.readdir(filePath, (err, files) => {
				if (err) {
					res.writeHead(404, "File not found", {"content-type": "text/html"})
					res.end(`<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
						<style>${styles}</style>
						<h1>404: File not found</h1>
						<p><code>${url}</code> requested</p>${err.message}</p>
						<a href="/${config.serverdir}">home page</a>`)
				}
				else {
					res.writeHead(200, {"content-type": "text/html"})
					files = files.map(item => {
						var parent = filePath.split("/").reverse()[1] +  "/" + filePath.split("/").reverse()[0]
						parent = parent.replace(replaceVal, "")
						// console.log(parent)
						return `<li><a href="${parent}/${item}">${item}</a></li>`
					}).join("")

					var greet = url !== "" ? url.substring(1) : "Papers"
					res.write(`
						<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
						<style>${styles}</style>
						<h1>${greet}</h1>
					`)
					res.end(`
						<ul>${files}</ul>
						<a href="/${config.serverdir}">home page</a>
					`)
				}
			});
		}
		else {
			console.log("should be pdf " + url)
			var parent = filePath.replace(config.content + "/", "")
			fs.readFile(parent, (err, data) => {
				if (err) {
					res.writeHead(404, "File not found", {"content-type": "text/html"})
					res.end(`
						<h1>404: File not found</h1>
						<p><code>${url}</code> requested</p>${err.message}</p>
						<a href="/${config.serverdir}">home page</a>
						<!-- You think you're slick but you're not -->`)
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
console.log("http://localhost:"+ config.port + "/" + config.serverdir)
server.listen(config.port)
