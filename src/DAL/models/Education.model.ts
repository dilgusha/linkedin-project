import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "educations" })
export class Education extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"varchar", length:100})
  school: string; 

  @Column({type:"varchar", length:150})
  degree: string; 

  @Column()
  fieldOfStudy: string; 

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;
}
