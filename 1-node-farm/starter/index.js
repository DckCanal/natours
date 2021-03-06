// Core modules
const fs = require("fs");
const http = require("http");
const url = require("url");

// 3rd party modules
const slugify = require("slugify");

// my own modules
const replaceTemplate = require("./modules/replaceTemplate");

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
const slugs = productData.map((prod) =>
  slugify(prod.productName, { lower: true })
);
productData.forEach((prod) => {
  prod.slug = slugify(prod.productName, { lower: true });
});
// console.log(productData);
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

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/overview" || pathname === "/") {
    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    res.writeHead(200, { "Content-type": "text/html" });
    const overviewHtml = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);
    res.end(overviewHtml);

    // Product page
  } else if (pathname === "/product") {
    // const product = productData[query.id];
    const product = productData.find((prod) => prod.slug === query.slug);
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);

    // API
  } else if (pathname === "/api") {
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
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Server running!\nListening on http://127.0.0.1:8080");
});
