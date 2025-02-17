import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { EDegreeType } from "../../Core/app/enums";

@Entity({ name: "educations" })
export class Education extends CommonEntity {
  @Column({ type: "varchar", length: 100 })
  schoolName: string;

  @Column({
    type: "enum",
    enum: EDegreeType,
    default: EDegreeType.OTHER,
  })
  degree: EDegreeType;

  @Column()
  faculty: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.educations)
  user: User[];
}
