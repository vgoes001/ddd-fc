import EventDispatcher from "../../@shared/event/event-dispatcher";
import EventHandlerInterface from "../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../../product/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../product/event/customer-created.event";
import SendConsoleLogHandler from "../../product/event/handler/send-console-log-handler";
import Address from "../value-object/address";

const eventDispatcher = new EventDispatcher();

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    const customerCreatedEvent = new CustomerCreatedEvent({ id, name });
    eventDispatcher.notify(customerCreatedEvent);
  }

  static addDomainEvent(eventName: string, eventHandler: EventHandlerInterface) {
    eventDispatcher.register(eventName, eventHandler);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    const customerAddressChangedEvent = new CustomerAddressChangedEvent(this);
    eventDispatcher.notify(customerAddressChangedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
