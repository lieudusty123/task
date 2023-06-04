import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Task {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  description: Description[];

  @Column()
  name: String;

  @Column()
  date: Date;
}

export class Description {
  @Column()
  descVal: string;

  @Column()
  date: Date;
}
