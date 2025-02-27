import { Request, Response, NextFunction } from "express";
import { Order } from "../../../DAL/models/Order.model";
import { User } from "../../../DAL/models/User.model";
import { Package } from "../../../DAL/models/Package.model";
import { EOrderStatus, ESubscriptionType } from "../../app/enums";
import { AuthRequest } from "../../../types";
import { CreateOrderDTO } from "./order.dto";
import { validate } from "class-validator";
import { formatErrors } from "../../middlewares/error.middleware";

const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { subscriptionType } = req.body;
    const packageId = Number(req.params.id);

    if (!packageId) {
      res.status(400).json({ message: "Package id is required!" });
      return;
    }

    const selectedPackage = await Package.findOne({ where: { id: packageId } });

    if (!selectedPackage) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    const dto = new CreateOrderDTO();
    dto.subscription_type = subscriptionType;

    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(422).json(formatErrors(errors));
      return;
    }

    let amount: number;
    if (subscriptionType === ESubscriptionType.MONTHLY) {
      amount = selectedPackage.monthly_price;
    } else if (subscriptionType === ESubscriptionType.YEARLY) {
      amount = selectedPackage.annual_price;
    } else {
      res.status(400).json({ message: "Invalid subscription type" });
      return;
    }

    const expiresAt = new Date();
    if (subscriptionType === subscriptionType) {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const newOrder = Order.create({
      user,
      amount,
      currency: selectedPackage.currency,
      status: EOrderStatus.PENDING,
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

const finishOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const status = req.params.status;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!status) {
      res.status(400).json({ message: "Status is required!" });
      return;
    }

    const order = await Order.findOne({
      where: { user },
      select: ["id", "status", "subscription_type", "updated_at"],
      relations: ["userPackage"],
    });

    if (!order || order.status !== EOrderStatus.PENDING) {
      res
        .status(400)
        .json({ message: "This order does not exist or already completed" });
      return;
    }
    let orderStatus: EOrderStatus;

    if (status === EOrderStatus.CANCELLED) {
      orderStatus = EOrderStatus.CANCELLED;
    } else if (status === EOrderStatus.FAILED) {
      orderStatus = EOrderStatus.FAILED;
    } else if (status === EOrderStatus.PAID) {
      orderStatus = EOrderStatus.PAID;
    } else {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    await Order.update(user.id, {
      status: orderStatus,
    });

    res.json({
      message: `Order is ${orderStatus}!`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const subscriptionType = async (req: Request, res: Response) => {
  res.status(200).json(ESubscriptionType);
};

export const OrderController = () => ({
  createOrder,
  finishOrder,
  subscriptionType,
});
