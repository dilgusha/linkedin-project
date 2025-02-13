import { Entity, PrimaryGeneratedColumn, ManyToOne  } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "connections" })
export class Connection extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User[];

  @ManyToOne(() => User)
  connection: User[];
}
