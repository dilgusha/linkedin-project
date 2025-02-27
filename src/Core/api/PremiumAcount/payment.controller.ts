import { Request,Response,NextFunction } from "express";
import { User } from "../../../DAL/models/User.model";
import { Order } from "../../../DAL/models/Order.model";
import { Payment, PaymentStatus } from "../../../DAL/models/Payment.model";


const createPayment = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const { userId, orderId, amount,transactionId} = req.body;
        if ( !userId || !orderId ||!amount || !transactionId) {
            res.status(400).json({message: "Please provide all the required fields"});
            return;
        }

        const user = await User.findOne({ 
            where : {id : userId}
        });
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        };

        const order = await Order.findOne({
            where : {id : orderId}
        });
        if (!order) {
            res.status(404).json({message: "Order not found"});
            return;
        };

        const payment = new Payment();
        payment.amount = amount;
        payment.transactionId = transactionId;
        payment.status = PaymentStatus.PENDING;

        const savedPayment = await Payment.save(payment);
        res.status(201).json({message : "Payment created saccessfully : ", savedPayment});
    } catch (error) {
        next(error);
    }
}

const listPayment = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const payments = await Payment.find({
            relations : ["user","order"],
            select : {
                id : true,
                amount : true,
                status : true,
                transactionId : true,
                user : {
                    id : true,
                    role : true,
                },
                order : {
                    id : true,
                    amount : true,
                    startDate : true,
                    endDate : true,
                }
            }
        });
        res.status(200).json({payments});
        return;
    } catch (error) {
        next(error);
    }
}

const getPaymentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const PaymentId = Number(req.params.id);
        
        if (isNaN(PaymentId)) {
            res.status(400).json({ message: "Payment ID is required and must be a number" });
            return;
        }

        const payment = await Payment.findOne({
            where: { id: PaymentId },  
            relations: ["user", "order"],
            select: {
                id: true,
                amount: true,
                status: true,
                transactionId: true,
                user: {
                    id: true,
                    role: true
                },
                order: {
                    id: true,
                    amount: true,
                    startDate: true,
                    endDate: true
                }
            }
        });

        if (!payment) {
            res.status(404).json({ message: "Payment not found" });
            return;
        }

        res.status(200).json({ payment });
    } catch (error) {
        next(error);
    }
};

export const PaymentController = () => ({
    createPayment,
    listPayment,
    getPaymentId
})