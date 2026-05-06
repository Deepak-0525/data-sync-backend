const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

const headers = {
  "X-Shopify-Access-Token": TOKEN,
  "Content-Type": "application/json",
};

app.get("/", (req, res) => {
  res.send("Shopify Sync Backend Running");
});


// =============================
// SAVE CART
// =============================

app.post("/api/cart/sync", async (req, res) => {
  try {
    const { customerId, cart } = req.body;

    const response = await axios.post(
      `https://${SHOP}/admin/api/2026-01/graphql.json`,
      {
        query: `
          mutation {
            metafieldsSet(metafields: [
              {
                ownerId: "gid://shopify/Customer/${customerId}",
                namespace: "custom",
                key: "synced_cart",
                type: "json",
                value: ${JSON.stringify(JSON.stringify(cart))}
              }
            ]) {
              metafields {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      },
      { headers }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});


// =============================
// GET CART
// =============================

app.get("/api/cart/:customerId", async (req, res) => {
  try {

    const customerId = req.params.customerId;

    const response = await axios.post(
      `https://${SHOP}/admin/api/2026-01/graphql.json`,
      {
        query: `
          {
            customer(id: "gid://shopify/Customer/${customerId}") {
              metafield(namespace: "custom", key: "synced_cart") {
                value
              }
            }
          }
        `,
      },
      { headers }
    );

    const value =
      response.data.data.customer.metafield?.value || "[]";

    res.json(JSON.parse(value));

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});


// =============================
// SAVE WISHLIST
// =============================

app.post("/api/wishlist/sync", async (req, res) => {
  try {

    const { customerId, wishlist } = req.body;

    const response = await axios.post(
      `https://${SHOP}/admin/api/2026-01/graphql.json`,
      {
        query: `
          mutation {
            metafieldsSet(metafields: [
              {
                ownerId: "gid://shopify/Customer/${customerId}",
                namespace: "custom",
                key: "synced_wishlist",
                type: "json",
                value: ${JSON.stringify(JSON.stringify(wishlist))}
              }
            ]) {
              metafields {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      },
      { headers }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});


// =============================
// GET WISHLIST
// =============================

app.get("/api/wishlist/:customerId", async (req, res) => {
  try {

    const customerId = req.params.customerId;

    const response = await axios.post(
      `https://${SHOP}/admin/api/2026-01/graphql.json`,
      {
        query: `
          {
            customer(id: "gid://shopify/Customer/${customerId}") {
              metafield(namespace: "custom", key: "synced_wishlist") {
                value
              }
            }
          }
        `,
      },
      { headers }
    );

    const value =
      response.data.data.customer.metafield?.value || "[]";

    res.json(JSON.parse(value));

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});2