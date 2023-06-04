const express = require("express");
const app = express();
const serverPort = 4000;

import { Description, Task } from "./entity/Task";
import { AppDataSource } from "./data-source";
import * as cors from "cors";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

AppDataSource.initialize()
  .then(async () => {
    console.log("Data initialized");
    AppDataSource.getMongoRepository(Task).find({});
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());
app.get("/getAllTasks", async (req: Request, res: Response) => {
  const data = await AppDataSource.getMongoRepository(Task).find();
  res.status(200).send(data);
});
app.post("/newTask", async (req: Request, res: Response) => {
  const task = new Task();
  task.date = new Date();
  task.name = req.body.name;
  task.description = [{ descVal: req.body.description.descVal, date: new Date() }];

  await AppDataSource.manager.save(task);

  res.status(200).send("added new task");
});

app.delete("/removeTaskDesc", async (req: Request, res: Response) => {
  const allDescForTask = await AppDataSource.manager.findOneBy(Task, { id: req.body.taskID });

  let desiredIndex = allDescForTask.description.findIndex((desc) => desc.date === req.body.date);
  let sliced = { ...allDescForTask };
  sliced.description.splice(desiredIndex, 1);
  await AppDataSource.manager.update(Task, { id: req.body.taskID }, sliced);

  res.status(200).send("");
});
app.post("/addTaskDesc", async (req: Request, res: Response) => {
  const taskID = req.body.taskID;
  const newDesc: Description = { descVal: req.body.descInput, date: new Date() };

  const taskRepository = AppDataSource.getMongoRepository(Task);
  const task = await taskRepository.findOneAndUpdate({ _id: new ObjectId(taskID) }, { $push: { description: newDesc } });

  res.status(200).send("");
});
app.listen(serverPort, () => console.log("server running"));
