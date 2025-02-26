import { IsDefined, IsEnum } from "class-validator";
import { ESubscriptionType } from "../../app/enums";

export class CreateOrderDTO {
  @IsDefined()
  @IsEnum(ESubscriptionType)
  subscription_type: ESubscriptionType;
}
