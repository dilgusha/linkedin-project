import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { Category } from "./Category.model";

@Entity({ name: "experinces" })
export class Experience extends CommonEntity {
  @Column({ type: "varchar", length: 100, default: null  })
  company: string;

  @Column({ type: "varchar", length: 100, default: null  })
  location: string;

  @Column({ type: "datetime", default: null  })
  startDate: Date;

  @Column({ type: "datetime", default: null  })
  endDate: Date;

  @Column({ type: "varchar", default: null  })
  description: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: "user_id" })
  user: User[];

  @ManyToMany(() => Category, (category) => category.experiences)
  @JoinTable({ name: "experiences_categories" })
  categories: Category[];
}
