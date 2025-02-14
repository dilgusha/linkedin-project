import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { Category } from "./Category.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "posts" })
export class Post extends CommonEntity {
  @Column({ type: "int" })
  likeCount: number;

  @Column({ type: "varchar", length: 150 })
  imagesPath: string;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User[];

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
