import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";
import { ConnectionStatus } from "../../Core/app/enums";

@Entity({ name: "connections" })
export class Connection extends CommonEntity {
  @ManyToOne(() => User, (user) => user.sentConnections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "requester_id" })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedConnections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @Column({
    type: "enum",
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;
}
