const express = require("express");
const app = express();
const serverPort = 4000;
require("dotenv").config();
import { sign, verify } from "jsonwebtoken";
import { Description, Task } from "./entity/Task";
import { AppDataSource } from "./data-source";
import * as cors from "cors";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

// Initialize connection with mongodb
AppDataSource.initialize()
  .then(async () => {
    console.log("Data initialized");
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());

app.get("/getAllTasks", authenticate, async (req: Request, res: Response) => {
  //Call the task repositor
  const data = await AppDataSource.manager.find(Task);
  res.status(200).send(data);
});

app.post("/newTask", authenticate, async (req: Request, res: Response) => {
  //Creates new task class and insert it to the tasks array
  const task = new Task();
  task.date = new Date();
  task.name = req.body.name;
  task.description = [{ _id: new ObjectId(), descVal: req.body.description.descVal, date: new Date() }];

  await AppDataSource.manager.save(task);

  res.status(200).send("added new task");
});

app.post("/removeTaskDesc", authenticate, async (req: Request, res: Response) => {
  const taskID = req.body.taskID;
  // Gets the relevant task from the DB
  const targetTask = await AppDataSource.manager.findOneBy(Task, { _id: new ObjectId(taskID) });

  // Finds the description we want to remove, create a copy of the object, splice the description out
  let desiredIndex = targetTask.description.findIndex((desc) => desc._id === req.body.descID);
  let sliced = { ...targetTask };
  sliced.description.splice(desiredIndex, 1);

  // inserting the new array to the DB
  await AppDataSource.manager.update(Task, { id: req.body.taskID }, sliced);

  res.sendStatus(200);
});
app.post("/addTaskDesc", authenticate, async (req: Request, res: Response) => {
  const taskID = req.body.taskID;

  // Creates new instance of Description and fill it with relevant values.

  const newDesc = new Description();
  newDesc.descVal = req.body.descInput;
  newDesc.date = new Date();

  // Finds the task that this description belongs to, and then pushes the description to the description array
  const taskRepository = AppDataSource.getMongoRepository(Task);
  await taskRepository.findOneAndUpdate({ _id: new ObjectId(taskID) }, { $push: { description: newDesc } });

  res.sendStatus(200);
});

app.post("/login", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are correct to our stored values

  if (username !== process.env.USER || password !== process.env.PASSWORD) {
    return res.status(401).send("Wrong username / password");
  }
  const user = { name: username, password: password };
  //Creates a new access token for the user and set expire for 2 hours
  const accessToken = sign(user, process.env.JWTTOKEN, { expiresIn: "2h" });
  res.status(200).send(accessToken);
});

function authenticate(req, res, next) {
  // This is a middleware function that will check if a user is authorized to access data

  const authHeader = req.headers.authorization;

  // Data comes as "Bearer <value>" so we need to make sure to split it first.
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.status(401).send();

  // verify function will get our saved token and the token given to the user and make sure they match
  verify(token, process.env.JWTTOKEN, (err, user) => {
    if (err) return res.status(403).send("token invalid");
    next();
  });
}

app.listen(serverPort, () => console.log("server running"));
