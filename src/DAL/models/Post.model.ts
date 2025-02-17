import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "posts" })
export class Post extends CommonEntity {
  @ManyToMany(() => User, (user) => user.likedPosts)
  likedUsers: User[];

  @Column({ type: "varchar", length: 150 })
  imagesPath: string[];

  @Column({ type: "text" })
  content: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
