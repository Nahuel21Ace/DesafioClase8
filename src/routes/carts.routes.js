import { Router } from "express";
import { cartsModel } from "../models/carts.models.js";
import { productsModel } from "../models/products.models.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
  try {
    const cart = await cartsModel.create({});
    res.status(200).send({ respuesta: "OK", mensaje: cart });
  } catch (error) {
    res.status(400).send({ respuesta: "Error creating cart", mensaje: error });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
    const cart = await cartsModel.findById(id);
    if (cart) res.status(200).send({ respuesta: "OK", mensaje: cart });
    else
      res.status(404).send({
        respuesta: "Error consulting cart",
        mensaje: "Cart not found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error consulting cart", mensaje: error });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartsModel.findById(cid);
    if (cart) {
      const prod = await productsModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex(
          (item) => item.id_prod._id == pid
        );
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
        const respuesta = await cartsModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error adding product to cart",
          mensaje: "Product not found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error adding product to cart",
        mensaje: "Cart not found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error adding product to cart", mensaje: error });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartsModel.findByIdAndUpdate(cid, { products: [] });
    if (cart) res.status(200).send({ respuesta: "OK", mensaje: cart });
    else
      res.status(404).send({
        respuesta: "Error emptying cart",
        mensaje: "Cart not found",
      });
  } catch (error) {
    res.status(400).send({ respuesta: "Error emptying cart", mensaje: error });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartsModel.findById(cid);
    if (cart) {
      const prod = await productsModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex(
          (item) => item.id_prod._id == pid
        );
        if (indice !== -1) {
          cart.products.splice(indice, 1);
        }
        const respuesta = await cartsModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error removing product from cart",
          mensaje: "Product not found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error removing product from cart",
        mensaje: "Cart not found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error removing product from cart", mensaje: error });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const prodsArray = req.body.products;

  if (!Array.isArray(prodsArray)) {
    return res
      .status(400)
      .send({ respuesta: "Error", mensaje: "Products should be an array" });
  }

  try {
    let cart = await cartsModel.findByIdAndUpdate(cid, { products: [] });
    if (cart) {
      cart.products = [];
      for (let prod of prodsArray) {
        const product = await productsModel.findById(prod.id_prod);

        if (product) {
          cart.products.push({
            id_prod: prod.id_prod,
            quantity: prod.quantity,
          });

          const respuesta = await cartsModel.findByIdAndUpdate(cid, cart);

          res.status(200).send({ respuesta: "OK", mensaje: respuesta });
        } else {
          res.status(404).send({
            respuesta: "Error adding product to update cart",
            mensaje: "Product not found",
          });
        }
      }
    } else {
      res.status(404).send({
        respuesta: "Error updating cart",
        mensaje: "Cart not found",
      });
    }
  } catch (error) {
    res.status(400).send({ respuesta: "Error updating cart", mensaje: error });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartsModel.findById(cid);
    if (cart) {
      const prod = await productsModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex(
          (item) => item.id_prod._id == pid
        );
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        } else {
          res.status(404).send({
            respuesta: "Error updating product in cart",
            mensaje: "Product not found in cart",
          });
        }
        const respuesta = await cartsModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error updating product in cart",
          mensaje: "Product not found",
        });
      }
    } else {
      res.status(404).send({
        respuesta: "Error updating product in cart",
        mensaje: "Cart not found",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ respuesta: "Error updating product in cart", mensaje: error });
  }
});

export default cartsRouter;