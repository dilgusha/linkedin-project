import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.model";
import { OrderStatus } from "../../Core/app/enums";
import { CommonEntity } from "./Common.model";

// export enum SubscriptionType {
//     MONTHLY = "monthly",
//     YEARLY = "yearly",
// }

@Entity()
export class Order extends CommonEntity {
    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: "varchar", length: 10, default: "USD" })
    currency: string;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    // @Column({ type: "enum", enum: SubscriptionType })
    // subscription_type: SubscriptionType;

    

    @Column({ type: "timestamp", nullable: true })
    expires_at: Date; // Abunəliyin bitmə tarixi

    @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
    user: User;
}