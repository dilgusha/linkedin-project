import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User.model";
import { Post } from "./Post.model";

@Entity({ name: "comments" })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User[];

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post[];
}
