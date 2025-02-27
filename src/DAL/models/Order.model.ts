import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { Payment } from "./Payment.model";

export enum OrderStatus {
    ACTIVE = "ACTIVE",
    CANCELED = "CANCELED",
    EXPIRED = "EXPIRED"
}

@Entity({ name: "orders" })
export class Order extends CommonEntity {
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number; 

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.ACTIVE })
    status: OrderStatus;

    @Column({ type: "datetime" , nullable : true  })
    startDate: Date;

    @Column({ type: "datetime" , nullable : true })
    endDate: Date;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Payment, (payment) => payment.order)
    payments: Payment[];
}
