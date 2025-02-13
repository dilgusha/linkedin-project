import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { Category } from "./Category.model";


@Entity({ name: "posts" })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  likeCount: number;

  @Column({ type: "varchar", length: 150 })
  imagesPath: string;

  @Column({ type: "text" })
  description: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User[];

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
