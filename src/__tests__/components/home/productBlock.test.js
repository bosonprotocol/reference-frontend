import React from "react";
import { render } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import ProductBlock from "../../../components/home/ProductBlock";

/** Required to wrap element due to HREF link.
 * Enzyme fails if component passed to render()
 * contains a link.
 */
function wrapProductBlock(price, deposit, paymentType) {
  return (
    <MemoryRouter>
      <ProductBlock price={price} deposit={deposit} paymentType={paymentType} />
    </MemoryRouter>
  );
}

describe("Component - Product Block - Price/Deposit", () => {
  it("When payment type 1 - Expect Price:ETH & Deposit:ETH", () => {
    const htmlPriceClass = "price"; // name of html class for "price" div

    const price = "0.1";
    const deposit = "0.01";
    const paymentType = 1; // ETH-ETH

    const wrapper = render(wrapProductBlock(price, deposit, paymentType));
    const productBlockHTMLObject = wrapper[Object.keys(wrapper)[0]].children[0]; // enter object (only contains 1 element) & extract div
    const productBlockChildElements = productBlockHTMLObject.children; // extract array of elements within Product Block
    const priceObject = productBlockChildElements.filter((el) =>
      el.attribs.class?.includes(htmlPriceClass)
    )[0]; // find "price" element by html class

    const priceElement = priceObject.children[0]; // extract price element
    const priceData = priceElement.children[1].data.trim().split(" "); // extract price element's value data (amount & currency)

    const depositElement = priceObject.children[1]; // extract deposit element
    const depositData = depositElement.children[1].data.trim().split(" "); // extract deposit element's value data (amount & currency)

    expect(priceData[0]).toBe(price);
    expect(priceData[1]).toBe("ETH");
    expect(depositData[0]).toBe(deposit);
    expect(depositData[1]).toBe("ETH");
  });

  it("When payment type 2 - Expect Price:ETH & Deposit:BSN", () => {
    const htmlPriceClass = "price"; // name of html class for "price" div

    const price = "0.1";
    const deposit = "0.01";
    const paymentType = 2; // ETH-BSN

    const wrapper = render(wrapProductBlock(price, deposit, paymentType));
    const productBlockHTMLObject = wrapper[Object.keys(wrapper)[0]].children[0]; // enter object (only contains 1 element) & extract div
    const productBlockChildElements = productBlockHTMLObject.children; // extract array of elements within Product Block
    const priceObject = productBlockChildElements.filter((el) =>
      el.attribs.class?.includes(htmlPriceClass)
    )[0]; // find "price" element by html class

    const priceElement = priceObject.children[0]; // extract price element
    const priceData = priceElement.children[1].data.trim().split(" "); // extract price element's value data (amount & currency)

    const depositElement = priceObject.children[1]; // extract deposit element
    const depositData = depositElement.children[1].data.trim().split(" "); // extract deposit element's value data (amount & currency)

    expect(priceData[0]).toBe(price);
    expect(priceData[1]).toBe("ETH");
    expect(depositData[0]).toBe(deposit);
    expect(depositData[1]).toBe("BSN");
  });

  it("When payment type 3 - Expect Price:BSN & Deposit:ETH", () => {
    const htmlPriceClass = "price"; // name of html class for "price" div

    const price = "0.1";
    const deposit = "0.01";
    const paymentType = 3; // BSN-ETH

    const wrapper = render(wrapProductBlock(price, deposit, paymentType));
    const productBlockHTMLObject = wrapper[Object.keys(wrapper)[0]].children[0]; // enter object (only contains 1 element) & extract div
    const productBlockChildElements = productBlockHTMLObject.children; // extract array of elements within Product Block
    const priceObject = productBlockChildElements.filter((el) =>
      el.attribs.class?.includes(htmlPriceClass)
    )[0]; // find "price" element by html class

    const priceElement = priceObject.children[0]; // extract price element
    const priceData = priceElement.children[1].data.trim().split(" "); // extract price element's value data (amount & currency)

    const depositElement = priceObject.children[1]; // extract deposit element
    const depositData = depositElement.children[1].data.trim().split(" "); // extract deposit element's value data (amount & currency)

    expect(priceData[0]).toBe(price);
    expect(priceData[1]).toBe("BSN");
    expect(depositData[0]).toBe(deposit);
    expect(depositData[1]).toBe("ETH");
  });

  it("When payment type 4 - Expect Price:BSN & Deposit:BSN", () => {
    const htmlPriceClass = "price"; // name of html class for "price" div

    const price = "0.1";
    const deposit = "0.01";
    const paymentType = 4; // BSN-BSN

    const wrapper = render(wrapProductBlock(price, deposit, paymentType));
    const productBlockHTMLObject = wrapper[Object.keys(wrapper)[0]].children[0]; // enter object (only contains 1 element) & extract div
    const productBlockChildElements = productBlockHTMLObject.children; // extract array of elements within Product Block
    const priceObject = productBlockChildElements.filter((el) =>
      el.attribs.class?.includes(htmlPriceClass)
    )[0]; // find "price" element by html class

    const priceElement = priceObject.children[0]; // extract price element
    const priceData = priceElement.children[1].data.trim().split(" "); // extract price element's value data (amount & currency)

    const depositElement = priceObject.children[1]; // extract deposit element
    const depositData = depositElement.children[1].data.trim().split(" "); // extract deposit element's value data (amount & currency)

    expect(priceData[0]).toBe(price);
    expect(priceData[1]).toBe("BSN");
    expect(depositData[0]).toBe(deposit);
    expect(depositData[1]).toBe("BSN");
  });
});
