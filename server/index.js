const http = require("http");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1";
const port = 3000;
const publicDirectory = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  let filePath = "";

  if (req.url === "/") {
    // 这里简单一点只访问 / => index.html
    filePath = path.join(publicDirectory, "/index.html");
  } else {
    // 其他请求直接拦截
    res.end("");
    return;
  }

  // 根据文件扩展名设置Content-Type
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
  };

  fs.readFile(filePath, (_, data) => {
    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      mimeTypes[extname] || "application/octet-stream"
    );
    res.end(data);
  });
});

server.listen(port, hostname, () => {
  console.log(`访问服务器已启动:  http://${hostname}:${port}/`);
});
