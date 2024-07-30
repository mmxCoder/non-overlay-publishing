const express = require("express");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const compressing = require("compressing");

// const multer = require("multer");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));

// 提供一个上传打包文件的接口
app.post(
  "/uploadAssets",
  express.raw({ type: "application/zip", limit: "50mb" }),
  (req, res) => {
    compressing.zip
      .uncompress(req.body, path.resolve(__dirname, "public"))
      .then(() => {
        res.send({
          code: 200,
          message: "成功",
          data: null,
        });
      })
      .catch((err) => {
        res.status(500).send("服务器处理错误, 请稍后再试", err);
      });
  }
);

// 启动服务器
app.listen(port, () => {
  console.log(`静态资源服务器运行在 http://localhost:${port}`);
});
