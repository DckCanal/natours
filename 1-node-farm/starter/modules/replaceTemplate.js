// exporting an anonymus function
module.exports = function (temp, product) {
  let output = temp
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%SLUG%}/g, product.slug)
    .replace(/{%QUANTITY%}/g, product.quantity);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  else output = output.replace(/{%NOT_ORGANIC%}/g, "");

  return output;
};
