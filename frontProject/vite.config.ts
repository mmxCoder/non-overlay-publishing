import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import compressing from "compressing";
import path from "path";
import fs from "fs";
import axios from "axios";

// 获取文件夹名
function getName() {
  return `my-vue-app-${Date.now()}`;
}
const __dirname = path.resolve();

// 这里处理一下压缩并将文件发送到服务器
function compress(name: string, outDir: string) {
  const dirPath = path.resolve(__dirname, outDir);
  const zipPath = path.resolve(__dirname, `${name}.zip`);

  // 发送到资源服务器
  const sendToAssetsServer = () => {
    // 删除压缩包.
    const removeZip = () => {
      fs.rm(zipPath, { force: true }, (err) => {
        if (err) return console.log("删除文件失败", err);
      });
    };

    return new Promise((resolve, reject) => {
      compressing.zip
        .compressDir(dirPath, zipPath)
        .then(() => {
          fs.readFile(zipPath, (err, data) => {
            if (err) {
              reject(err);
              return;
            }

            axios
              .post("http://localhost:3000/uploadAssets", data, {
                headers: {
                  "Content-Type": "application/zip",
                },
              })
              .then(() => {
                removeZip();
                resolve(true);
              });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 发送到访问服务器
  const sendToServer = () => {
    return new Promise((resolve, reject) => {
      const indexHtmlPath = path.resolve(dirPath, "index.html");
      fs.readFile(indexHtmlPath, (err, data) => {
        if (err) return reject(err);
        axios
          .post("http://localhost:3001/uploadFile", data)
          .then(resolve, reject);
      });
    });
  };

  return {
    name: "compress",
    // 打包结束执行.
    closeBundle() {
      Promise.all([sendToAssetsServer(), sendToServer()])
        .then(() => {
          console.log("资源已发送成功, 请访问: http://localhost:3001/");
        })
        .catch((err) => {
          console.log("服务执行失败 => ", err);
        });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const name = getName();
  const outDir = "dist/" + name;

  return {
    plugins: [vue(), compress(name, outDir)],
    build: {
      outDir,
    },
    // 开发环境不动, 只在生产环境才用这个资源服务器链接.
    base: isDev ? "/" : `http://localhost:3000/${name}/`,
  };
});
