const { createServer } = require("http");
const { Server } = require("ws");
const { createReadStream } = require("fs");
const { resolve } = require("path");
const { Message, messages } = require('./messages');

const basePath = resolve(__dirname, "../client");
const PORT = parseInt(process.env.PORT, 10) || 3000;

function sendFile(path, res, contentType) {
  const filePath = resolve(basePath, path);
  const stream = createReadStream(filePath);

  res.writeHead(200, "OK", {
    "Content-Type": contentType
  });

  stream.pipe(res);
}

const server = createServer((req, res) => {
  switch (req.url) {
    case "/":
      return sendFile("index.html", res, "text/html");
    case "/style.css":
      return sendFile("style.css", res, "text/css");
    case "/main.js":
      return sendFile("main.js", res, "application/javascript");
  }
});

const ws = new Server({ server });



ws.on('connection', (socket) => {
  socket.send(JSON.stringify(messages));
  
  socket.on('message', data => {
    const message = Message.fromJson(data)

    messages.push(message);
    
    ws.clients.forEach((client) => client.send(JSON.stringify(message)));
  });
})

server.listen(PORT, () =>
  console.log(`🚀 Server is running http://localhost:${PORT}`)
);
