import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./User.model";
import { Comment } from "./Comment.model";
import { CommonEntity } from "./Common.model";
import { ImageModel } from "./Image.model";

@Entity({ name: "posts" })
export class Post extends CommonEntity {
  @ManyToMany(() => User, (user) => user.likedPosts)
  likedUsers: User[];

  // @OneToOne(() => ImageModel, { onDelete: "CASCADE" })
  // @JoinColumn()
  // image?: ImageModel

  @Column({ type: "varchar", length: 150 })
  imagePath?: string;

  @Column({ type: "varchar", default: null  })
  content: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: "CASCADE" })
  comments: Comment[];
}
