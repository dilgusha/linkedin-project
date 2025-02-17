import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.model";
import { Post } from "./Post.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "comments" })
export class Comment extends CommonEntity {
  @Column()
  content: string;

  @Column({ type: "int" })
  user_id: number;
  
  @Column({ type: "int" })
  post_id: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "user_id" })
  user: User[];

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: "post_id" })
  post: Post;
}
