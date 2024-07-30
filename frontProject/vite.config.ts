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

  // 删除压缩包.
  const removeZip = () => {
    fs.rm(zipPath, { force: true }, (err) => {
      if (err) return console.log("删除文件失败", err);
      console.log("删除zip文件成功");
    });
  };

  return {
    name: "compress",
    // 打包结束执行.
    closeBundle() {
      compressing.zip
        .compressDir(dirPath, zipPath)
        .then((data) => {
          fs.readFile(zipPath, (err, data) => {
            if (err) return console.log("读取文件失败", err);

            axios
              .post("http://localhost:3000/uploadAssets", data, {
                headers: {
                  "Content-Type": "application/zip",
                },
              })
              .then(() => {
                console.log("发送成功");
                removeZip();
              });
          });
        })
        .catch((err) => {
          console.log("压缩失败", err);
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
