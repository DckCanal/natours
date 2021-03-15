const fs = require("fs");
const http = require("http");
const url = require("url");
////////////////////////////////
// FILE
///////////////////////////////////
// Blocking, synchronous way
// const textIn = fs.readFileSync(`txt/input.txt`, `utf-8`);
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("txt/output.txt", textOut);
// console.log("File written!");

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log(`ERROR!\n${err}`);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     if (err) return console.log(`ERROR!\n${err}`);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       if (err) return console.log(`ERROR!\n${err}`);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written!");
//         err && console.log(err);
//       });
//     });
//   });
// });
// console.log("Will read file!");

///////////////////////////////////////
// SERVER
///////////////////////////////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/overview" || pathName === "/") {
    res.end("This is the overview.");
  } else if (pathName === "/product") {
    res.end("This is the product.");
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello world!",
    });
    res.end("<h1>This page cannot be found.</h1>");
  }
  // res.end("Hello from the server!");
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Server running!\nListening on http://127.0.0.1:8080");
});
