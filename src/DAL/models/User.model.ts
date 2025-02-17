import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Experience } from "./Experience.model";
import { Education } from "./Education.model";
import { Post } from "./Post.model";
import { Connection } from "./Connection.model";
import { Vacancy } from "./Vacancy.model";
import { CommonEntity } from "./Common.model";
import { EGenderType, ERoleType } from "../../Core/app/enums";

@Entity({ name: "users" })
export class User extends CommonEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 150 })
  surname: string;

  @Column({
    type: "enum",
    enum: EGenderType,
    default: EGenderType.OTHER,
  })
  gender: EGenderType;

  @Column({ type: "varchar", length: 150 })
  email: string;

  @Column({ type: "varchar", length: 60 })
  password: string;

  @Column({ type: "int" })
  verifyCode: number;

  @Column({ type: "boolean" })
  isVerified: boolean;

  @Column({ type: "datetime" })
  verifyExpiredIn: Date;

  @Column({
    type: "enum",
    enum: ERoleType,
    default: ERoleType.USER,
  })
  role: ERoleType;

  @Column({ nullable: true })
  avatar_path: string;

  @Column({ type: "text" })
  about: string;

  @Column({ type: "varchar", length: 150 })
  companyName: string;

  @Column({ type: "datetime" })
  birthdate: Date;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "boolean", default: false })
  isVisibility: boolean;

  @Column({ type: "varchar" })
  passToken: String;

  @Column({ type: "varchar" })
  resetExpiredIn: Date;

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.likedUsers)
  @JoinTable({
    name: "users_liked_posts",
    joinColumn: { name: "user_id" },
    inverseJoinColumn: { name: "post_id" },
  })
  likedPosts: Post[];

  @OneToMany(() => Connection, (connection) => connection.user)
  connections: User[];

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.appliedUsers)
  @JoinTable()
  appliedVacancies: Vacancy[];
}
