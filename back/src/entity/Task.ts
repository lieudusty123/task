import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  description: Description[];

  @Column()
  name: String;

  @Column()
  date: Date;
}

export class Description {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  descVal: string;

  @Column()
  date: Date;
}
