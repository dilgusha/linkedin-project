import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "experinces" })
export class Experience extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.experiences)
  user: User[];
}
