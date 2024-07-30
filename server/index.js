const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));

app.use(express.raw({ type: "*/*" }));

// 接收 index.html
app.post("/uploadFile", (req, res) => {
  fs.writeFile(
    path.resolve(__dirname, "public/index.html"),
    req.body,
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({
        code: 200,
        message: "成功",
        data: null,
      });
    }
  );
});

// 启动服务器
app.listen(port, () => {
  console.log(`web容器服务器运行在 http://localhost:${port}`);
});
