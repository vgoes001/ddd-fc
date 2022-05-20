import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import ProductCreatedEvent from "../product-created.event";

export default class SendConsoleLogWhenCustomerChangedAddress
    implements EventHandlerInterface<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        console.log(
            `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name},`
            + `alterado para: ${event.eventData.Address.street}, ${event.eventData.Address._number}.`);
    }
}
