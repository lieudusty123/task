import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Task } from "./entity/Task";

export const AppDataSource = new DataSource({
  type: "mongodb",
  database: "0406",
  host: "localhost",
  port: 27017,
  synchronize: true,
  logging: false,
  entities: [Task],
  migrations: [],
  subscribers: [],
});
