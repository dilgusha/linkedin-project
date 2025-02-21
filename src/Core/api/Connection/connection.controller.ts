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

    const receiver = await User.findOne({ where: { id: receiverId } });
    if (!receiver) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const existingConnection = await Connection.findOne({
        where: { requester: { id: requester.id }, receiver: { id: receiver.id } },
        relations: ["requester", "receiver"],  
      });

    console.log(existingConnection);

    if (existingConnection) {
      res.status(400).json({ message: "Connection already exists" });
      return;
    }

    const connection = Connection.create({
      requester,
      receiver,
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

if(!receiver){
    res.json("User not found!")
    return
}

    const connection = await Connection.findOne({
        where: { id: connectionId, receiver: { id: receiver.id } },
        relations: ["requester", "receiver"],  
      });

      
    if (!connection) {
      res.status(404).json({ message: "Connection not found" });
      return;
    }

    connection.status = ConnectionStatus.ACCEPTED;
    await connection.save();

    res.status(200).json({ message: "Connection accepted", connection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const ConnectionController = () => ({
  sendConnectionRequest,
  acceptConnection,
});
