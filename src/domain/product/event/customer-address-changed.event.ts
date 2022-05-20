import EventInterface from "../../@shared/event/event.interface";
import Customer from "../../customer/entity/customer";

export default class CustomerAddressChangedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: Customer


    constructor(eventData: any) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}
