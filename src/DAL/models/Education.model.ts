import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { EDegreeType } from "../../Core/app/enums";

@Entity({ name: "educations" })
export class Education extends CommonEntity {
  @Column({ type: "varchar", length: 100, default: null  })
  schoolName: string;

  @Column({
    type: "enum",
    enum: EDegreeType,
    default: EDegreeType.OTHER,
  })
  degree: EDegreeType;

  @Column({ type: "varchar", length: 100, default: null  })
  faculty: string;

  @Column({ type: "datetime", default: null  })
  startDate: Date;

  @Column({type: "datetime", nullable: true })
  endDate: Date;

  @Column({ type: "varchar", default: null  })
  imageUrl?: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.educations)
  @JoinColumn({ name: "user_id" })
  user: User[];
}
