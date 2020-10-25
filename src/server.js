const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AdminBro = require("admin-bro");
const options = require("./admin/admin.options");
const buildAdminRouter = require("./admin/admin.router");

const indexRouter = require("./routes/index");

const app = express();
const port = process.env.PORT || 3000;

const run = async () => {
  try { 
    await mongoose.connect(
      "mongodb+srv://1:1@cluster0.w2xig.mongodb.net/gigpeople?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("DB Connected Successfully!");
  } catch (err) { 
    console.log("DB Connection Failed", err);
  }

  app.use(cors());
  app.use(logger("dev"));

  app.use(express.static('public'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cookieParser());
  app.use("/api", indexRouter);

  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`gigpeople backend listening at http://localhost:${port}`);
  });
};

module.exports = run;
