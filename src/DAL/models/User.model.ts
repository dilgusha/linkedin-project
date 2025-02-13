import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Experience } from "./Experience.model";
import { Education } from "./Education.model";
import { Post } from "./Post.model";
import { Connection } from "./Connection.model";
import { Vacancy } from "./Vacancy.model";

export enum ERoleType {
  USER = "USER",
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
}
export enum EGenderType {
  MAN = "MAN",
  WOMAN = "WOMAN",
  OTHER = "OTHER",
}

export enum EStatusType {
  ACTIVE = "ACTIVE",
  DEACTIVE = "DEACTIVE",
}

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: "varchar", length: 100 })
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
  profilePicture: string;

  @Column({ type: "text"})
  about: string;

  @Column({ type: "datetime" })
  birthdate: Date;

  @Column({ type: "varchar" })
  phone: string;

  @Column({
    type: "enum",
    enum: EStatusType,
    default: EStatusType.ACTIVE,
  })
  status: EStatusType;

  @Column({ type: "boolean", default: false })
  isVisibility: boolean;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @OneToMany(() => Experience, (experience) => experience.user)
  experiences: Experience[];

  @OneToMany(() => Education, (education) => education.user)
  educations: Education[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Connection, (connection) => connection.user)
  connections: Connection[];

  @OneToMany(() => Vacancy, (vacancy) => vacancy.user)
  vacancies: Vacancy[];
}
