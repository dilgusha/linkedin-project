import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { Post } from "./Post.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "comments" })
export class Comment extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User[];

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post[];
}
