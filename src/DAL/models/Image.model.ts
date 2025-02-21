import { BeforeRemove, Column, Entity } from "typeorm";
import { rmSync } from "fs";
import { join } from "path";
import { CommonEntity } from "./Common.model";
import { unlink } from "fs/promises";

@Entity('images')

export class ImageModel extends CommonEntity {
    @Column({ type: "varchar"})
    filename: string;

    @Column({ type: "varchar"})
    url: string;

    // @BeforeRemove()
    // beforeRemove() {
    //     rmSync(join(__dirname, '../../uploads', this.filename))
    // }

    @BeforeRemove()
    async beforeRemove() {
        try {
            const filePath = join(process.cwd(), 'uploads', this.filename);
            await unlink(filePath);
        } catch (error) {
            console.error("File deletion failed:", error);
        }
    }
}