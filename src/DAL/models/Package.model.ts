import { Column, Entity } from "typeorm";
import { CommonEntity } from "./Common.model";

@Entity({ name: "packages" })
export class Package extends CommonEntity {
    @Column({ type: "varchar", length: 150, default: null, unique: true })
    name: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: null })
    monthly_price: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: null })
    annual_price: string;
}