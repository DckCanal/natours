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
const replaceTemplate = function (temp, product) {
  let output = temp
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%QUANTITY%}/g, product.quantity);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  else output = output.replace(/{%NOT_ORGANIC%}/g, "");

  return output;
};
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === "/overview" || pathName === "/") {
    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    res.writeHead(200, { "Content-type": "text/html" });
    const overviewHtml = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);
    res.end(overviewHtml);

    // Product page
  } else if (pathName === "/product") {
    res.end("This is the product.");

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not found
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
