import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import path from "path";
import { productsModel } from "./models/products.models.js";
import { messagesModel } from "./models/messages.models.js";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = 8080;
const app = express();

//Mongoose

mongoose
  .connect("mongodb+srv://coder_backend:hHMPL3crk3lkN3kk@micluster.5dbtokk.mongodb.net/MiDB?retryWrites=true&w=majority")
  .then(() => console.log("DB connected"))
  .catch(() => console.log("Error en conexion a BDD"));

//Config

const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));
app.use("/chat", express.static(path.join(__dirname, "/public")));

//Server with express
const io = new Server(serverExpress);

io.on("connection", (socket) => {
  console.log("Servidor Socket.io conectado");
  socket.on("newProd", async (prod) => {
    const { title, description, code, price, stock, category } = prod;

    try {
      const prod = await productsModel.create({
        title,
        description,
        code,
        price,
        stock,
        category,
      });
      console.log("Product added successfully");
    } catch (error) {
      console.error("Error creating product");
    }

    let prods = await productsModel.find();
    socket.emit("prodsData", prods);
  });

  socket.on("deleteProd", async (idDelete) => {
    const idToDelete = idDelete;

    const prod = await productsModel.findById(idToDelete);

    if (prod) {
      await productsModel.findByIdAndDelete(idToDelete);
      console.log("Product removed seccessfully");
    } else {
      console.error("Product not found");
    }

    let prods = await productsModel.find();
    socket.emit("prodsData", prods);
  });

  socket.on("initialProds", async () => {
    try {
      let prods = await productsModel.find();
      socket.emit("prodsData", prods);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("newMessage", async (newMessage) => {
    const { email, message } = newMessage;

    try {
      const createMessage = await messagesModel.create({
        email,
        message,
      });
      console.log("Message added successfully");
    } catch (error) {
      console.error("Error creating message");
    }

    let messages = await messagesModel.find();
    socket.emit("messageData", messages);
  });

  socket.on("initialMessages", async () => {
    try {
      let messages = await messagesModel.find();
      socket.emit("messageData", messages);
    } catch (error) {
      console.error(error);
    }
  });
});

let prodsStatic = [];
const getProds = async () => {
  try {
    prodsStatic = await productsModel.find().lean();
  } catch (error) {
    console.error(error);
  }
};
getProds();

//Routes

app.get("/", (req, res) => {
  res.send("Desafio de la clase 8/Segunda Pre Entrega");
});

app.use("/api/products", prodsRouter);
app.use("/api/carts", cartsRouter);

app.get("/static", (req, res) => {
  res.render("home", {
    css: "style.css",
    title: "Home",
    js: "home.js",
    listProds: prodsStatic,
  });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "style.css",
    title: "Products",
    js: "realTimeProducts.js",
  });
});

app.get("/chat", (req, res) => {
  res.render("chat", {
    css: "style.css",
    title: "Chat",
    js: "chat.js",
  });
});