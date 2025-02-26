import { Request, Response, NextFunction } from "express";
import { Order } from "../../../DAL/models/Order.model";
import { User } from "../../../DAL/models/User.model";
import { Package } from "../../../DAL/models/Package.model";
import { OrderStatus } from "../../app/enums"; 
import { AuthRequest } from "../../../types";

const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

    const { packageId, subscriptionType } = req.body;

    const selectedPackage = await Package.findOne({ where: { id: packageId } });

    if (!selectedPackage) {
      res.status(404).json({ message: "Package not found" });
      return
    }

    let amount: number;
    if (subscriptionType === "monthly") {
      amount = parseFloat(selectedPackage.monthly_price);
    } else if (subscriptionType === "yearly") {
      amount = parseFloat(selectedPackage.annual_price);
    } else {
      res.status(400).json({ message: "Invalid subscription type" });
      return
    }

    const expiresAt = new Date();
    if (subscriptionType === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const newOrder = Order.create({
      user,
      amount,
      currency: selectedPackage.currency,
      status: OrderStatus.PENDING,
      expires_at: expiresAt,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
    
  } catch (error) {
    res.status(500).json({
        message: "Something went wrong",
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const OrderController = () => ({
    createOrder,
  });
