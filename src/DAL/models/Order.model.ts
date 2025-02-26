import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { EOrderStatus, ESubscriptionType } from "../../Core/app/enums";
import { CommonEntity } from "./Common.model";
import { Package } from "./Package.model";

@Entity()
export class Order extends CommonEntity {
  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency: string;

  @Column({ type: "enum", enum: EOrderStatus, default: EOrderStatus.PENDING })
  status: EOrderStatus;

  @Column({ type: "enum", enum: ESubscriptionType })
  subscription_type: ESubscriptionType;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Package, (userPackage) => userPackage.orders, {
    onDelete: "CASCADE",
  })
  userPackage: Package;
}
