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

const categoryList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.perpage) || 5;

    const before_page = (page - 1) * limit;
    const [ list, total] = await Category.findAndCount({
      skip: before_page,
      take: limit,
    });

    if (list.length === 0) {
      res.status(404).json({
        message: "No categories found.",
      });
      return;
    }

    res.status(200).json({
      data: list,
      pagination: {
        users: total,
        currentPage: page,
        messagesCount: list.length,
        allPages: Math.ceil(Number(total) / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const CategoryController = () => ({
  deletee,
  createCategory,
    getAll,
    updatedCategory,
    categoryList
});
