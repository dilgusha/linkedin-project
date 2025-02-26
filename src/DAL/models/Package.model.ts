import { Column, Entity, OneToMany } from "typeorm";
import { CommonEntity } from "./Common.model";
import { Order } from "./Order.model";

@Entity({ name: "packages" })
export class Package extends CommonEntity {
    @Column({ type: "varchar", length: 150, default: null, unique: true })
    name: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: null })
    monthly_price: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: null })
    annual_price: number;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: "varchar", length: 10, default: "USD" })
    currency: string;

    @OneToMany(() => Order, (order) => order.userPackage)
    orders: Order[];
}