import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { Category } from "./Category.model";

@Entity({ name: "experinces" })
export class Experience extends CommonEntity {
  @Column()
  category: string;

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

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: "user_id" })
  user: User[];

  @OneToMany(() => Category, (category) => category.experience)
  @JoinColumn({ name: "category_id" })
  categories: Category[];

}
