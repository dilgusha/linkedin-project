import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"; 
import { CommonEntity } from "./Common.model";
import { User } from "./User.model";
import { Order } from "./Order.model";

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

@Entity({ name: "payments" })
export class Payment extends CommonEntity {
    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: "varchar", nullable: true })
    transactionId: string; 

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;


    @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Order, (order) => order.payments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "order_id" })
    order: Order;
}
