import { Request,Response,NextFunction } from "express";
import { User } from "../../../../DAL/models/User.model";
import { Order } from "../../../../DAL/models/Order.model";


const createOrder = async(req:Request , res:Response ,next:NextFunction):Promise<void> => {
    try {
        const {userId , amount } = req.body;
        if (!userId || !amount) {
            res.status(400).json({message:"userId and amount are required"});
            return;
        }

        const user = await User.findOneBy({ id : userId});
        if (!user) {
            res.status(404).json({message : `User not found`});
            return;
        }

        const order = Order.create({ user , amount });
        await order.save();

        res.status(201).json({
            message : `Order create successfully`,
            id : order.id,
            amount : order.amount,
        });
        return;
    } catch (error) {
        next(error);
    }
}

const listOrder = async(req:Request , res:Response ,next:NextFunction):Promise<void> => {
    try {
        const orders = await Order.find({
            relations : ["user" , "payments"],
            select : { 
                id : true,
                amount : true,
                status : true,
                user : {
                    id : true,
                    role : true,
                }
            }
        });
        res.status(201).json({ orders });
        return;
    } catch (error) {
        next(error);
    }
}

export const OrderController = () => ({
    createOrder,
    listOrder
});