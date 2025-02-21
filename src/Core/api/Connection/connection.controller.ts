import { Response } from "express";
import { AuthRequest } from "../../../types";
import { User } from "../../../DAL/models/User.model";
import { Connection } from "../../../DAL/models/Connection.model";
import { ConnectionStatus } from "../../app/enums";

const sendConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    const requester = req.user;
    if (!requester) {
      res.json("User not found");
      return;
    }

    const receiverId = Number(req.params.id);

    if (!receiverId) {
      res.status(400).json({ message: "Receiver ID required" });
      return;
    }

    if (requester.id === receiverId) {
      res.json("Siz ozunuze request ata bilmezsiz");
      return;
    }

    const receiver = await User.findOne({ where: { id: receiverId } });
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingConnection = await Connection.findOne({
      where: {
        requester_id: requester.id,
        receiver_id: receiver.id,
        status: ConnectionStatus.PENDING || ConnectionStatus.ACCEPTED,
      },
      relations: ["requester", "receiver"],
    });

    if (existingConnection) {
      res.status(400).json({ message: "Connection already exists" });
      return;
    }

    const connection = Connection.create({
      requester_id: requester.id,
      receiver_id: receiver.id,
      status: ConnectionStatus.PENDING,
    });

    await connection.save();

    res.status(201).json({ message: "Connection request sent", connection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptConnection = async (req: AuthRequest, res: Response) => {
  try {
    const receiver = req.user;
    const connectionId = Number(req.params.id);

    if (!receiver) {
      res.json("User not found!");
      return;
    }

    if (!connectionId) {
      res.json("Connection id not found!");
      return;
    }

    const connection = await Connection.findOne({
      where: { id: connectionId, receiver_id: receiver.id },
    });

    if (!connection) {
      res.status(404).json({ message: "Connection not found" });
      return;
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      res.json("Bele bir elaqe isteyi yoxdur");
      return;
    }

    connection.status = ConnectionStatus.ACCEPTED;
    await connection.save();

    res.status(200).json({ message: "Connection accepted", connection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const rejectConnection = async (req: AuthRequest, res: Response) => {
  try {
    const receiver = req.user;
    const { connectionId } = req.body;

    if (!receiver) {
      res.json("User not found!");
      return;
    }

    if (!connectionId) {
      res.json("Connection id not found!");
      return;
    }

    const connection = await Connection.findOne({
      where: {
        id: connectionId,
        receiver_id: receiver.id,
        status: ConnectionStatus.PENDING,
      },
    });

    if (!connection) {
      res.status(404).json({ message: "Connection not found" });
      return;
    }

    connection.status = ConnectionStatus.REJECTED;
    await connection.save();

    res.status(200).json({ message: "Connection rejected", connection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const list = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.perpage) || 5;

    const receiver = req.user;

    if (!receiver) {
      res.json("User not found!");
      return;
    }

    const before_page = (page - 1) * limit;
    const [list, total] = await Connection.findAndCount({
      where: { receiver_id: receiver.id, status: ConnectionStatus.PENDING },
      skip: before_page,
      take: limit,
    });

    if (list.length === 0) {
      res.status(404).json({
        message: "No connects found.",
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

export const ConnectionController = () => ({
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  list
});
