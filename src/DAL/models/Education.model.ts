import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "educations" })
export class Education extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  school: string;

  @Column({ type: "varchar", length: 150 })
  degree: string;

  @Column()
  fieldOfStudy: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.educations)
  user: User[];
}
