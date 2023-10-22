import { Router } from "express";
import { productsModel } from "../models/products.models.js";

const prodsRouter = Router();

prodsRouter.get("/", async (req, res) => {
  const { status, category, limit, page, sort } = req.query;

  const limitP = limit ?? 10;
  let pageP = page ?? 1;
  let queryP = {};
  const categoryP = category;
  const statusP = status;
  const sortP = sort;
  if (status) {
    queryP = { status: statusP };
  } else if (category) {
    queryP = { category: categoryP };
  }

  try {
    const prods = await productsModel.paginate(queryP, {
      limit: limitP,
      page: pageP,
      sort: { price: sortP },
    });

    const resProds = {
      status: "success",
      payload: prods.docs,
      totalPages: prods.totalPages,
      prevPage: prods.prevPage,
      nextPage: prods.nextPage,
      page: prods.page,
      hasPrevPage: prods.hasPrevPage,
      hasNextPage: prods.hasNextPage,
      prevLink: prods.hasPrevPage ? null : null,
      nextLink: prods.hasNextPage ? null : null,
    };
    res.status(200).send({ respuesta: "OK", mensaje: resProds });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error consulting products", mensaje: error });
  }
});

prodsRouter.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const prod = await productsModel.findById(id);
    if (prod) res.status(200).send({ respuesta: "OK", mensaje: prod });
    else
      res.status(404).send({
        respuesta: "Error consulting product",
        mensaje: "Product not found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error consulting product", mensaje: error });
  }
});

prodsRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  try {
    const prod = await productsModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
    });
    res.status(200).send({ respuesta: "OK", mensaje: prod });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error creating product", mensaje: error });
  }
});

prodsRouter.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;

  try {
    const prod = await productsModel.findByIdAndUpdate(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    if (prod) {
      res
        .status(200)
        .send({ respuesta: "OK", mensaje: "Product updated successfully" });
    } else {
      res.status(404).send({
        respuesta: "Error updating product",
        mensaje: "Product not found",
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error updating product", mensaje: error });
  }
});

prodsRouter.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const prod = await productsModel.findByIdAndDelete(id);
    if (prod)
      res
        .status(200)
        .send({ respuesta: "OK", mensaje: "Product removed seccessfully" });
    else
      res.status(404).send({
        respuesta: "Error removing product",
        mensaje: "Product not found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error removing product", mensaje: error });
  }
});

export default prodsRouter;