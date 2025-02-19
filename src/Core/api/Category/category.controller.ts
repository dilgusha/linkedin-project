import { NextFunction, Request, Response } from "express";
import { Category } from "../../../DAL/models/Category.model";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json({ message: "Name and description are required" });
      return;
    }

    const newCategory = new Category();
    newCategory.name = name;
    newCategory.description = description;

    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deletee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id: +id },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await category.remove();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

export const CategoryController = () => ({
  deletee,
  createCategory,
});
