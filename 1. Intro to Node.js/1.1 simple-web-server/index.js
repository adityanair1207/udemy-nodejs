const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/") {
    res.end("Hello from the main page!");
  } else if (pathName === "/details") {
    res.end("Hello from the details page!");
  } else {
    res.writeHead(404, {
      "content-encoding": "text/html",
    });
    res.end("<h1>Path not found :(</h1>");
  }

  //   res.end(`Hello from the server!`);
});

server.listen(8000, () => {
  console.log("Listening to requests on port 8000");
});
