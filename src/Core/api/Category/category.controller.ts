import { NextFunction, Request, Response } from "express";
import { Category } from "../../../DAL/models/Category.model";
import { AuthRequest } from "../../../types";
import { CategoryCreateDto } from "./category.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";

const createCategory = async (req: Request,  res: Response,  next: NextFunction) => {
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
const updatedCategory = async(req:AuthRequest,res:Response,next:NextFunction)=>{
  try{
  const user = req.user
  if(!user){
    res.json("user not found")
    return
  }
  const category_id =Number(req.params)
  if(!category_id){
    res.json("Id is required")
    return
  }
  const{name,description} = req.body
  const dto = new CategoryCreateDto()
  dto.name = name;
  dto.description = description;

  const errors = await validate(dto)
  if(errors.length > 0){
    res.status(400).json(formatErrors(errors))
    return
  }
  const category =await Category.findOne({
    where:{id:category_id}
  })
  if(!category){
    res.status(404).json({message:"category not found"})
  return}

  const updatedData = await Category.update(category_id,{
    name,
    description
  })
  res.status(200).json({
    message:"Category updated succesfully",
    data:updatedData,
  })
}catch(error){
  res.status(500).json({
    message:"Internal server error",
    error,
  })
}
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
    
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

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
    getAll
});
