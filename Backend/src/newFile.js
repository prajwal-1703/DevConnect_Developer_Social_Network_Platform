import express from "express";
import path from "path";
import { app } from "./app";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
