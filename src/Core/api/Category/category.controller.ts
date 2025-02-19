import { NextFunction, Request, Response } from "express";
import { Category } from "../../../DAL/models/Category.model";

const deletee = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params

        const category = await Category.findOne({
            where: {id: +id}
        })
        
        if (!category) {
            res.status(404).json({message: "Category not found"});
            return;
        }
        
        await category.remove();
        
        res.status(200).json({message: "Category deleted successfully"});
        
    } catch (error) {
        
        res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}

export const CategoryController = () => ({
deletee
});