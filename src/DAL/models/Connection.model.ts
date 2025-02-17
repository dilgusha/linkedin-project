import { Entity, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "connections" })
export class Connection extends CommonEntity {
  @ManyToOne(() => User)
  user: User[];

  @ManyToOne(() => User)
  connection: User[];
}
