import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User.model";


@Entity({ name: "connections" })
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User[];

  @ManyToOne(() => User)
  connection: User[];
}
