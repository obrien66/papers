var fs = require("fs")
var prompt = require("prompt")

var props = [
	{
		name: "port",
		validator: /([0-9])+/,
		warning: "Port must be a number"
	},
	{
		name: "content_directory"
	},
	{
		name: "server_directory"
	}
]

prompt.start()

prompt.get(props, (err, data) => {
	if (err) {throw err}
	var fileData = JSON.stringify({
		"content": data.content_directory,
		"port": data.port,
		"serverdir": data.server_directory
	})
	fs.writeFile("src/pref.json", fileData, (err) => {
		if (err) {
			throw err
		}
	});
})
