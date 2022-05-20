import SendConsoleLogHandler from "../../product/event/handler/send-console-log-handler";
import SendConsoleLogWhenCustomerChangedAddress from "../../product/event/handler/send-console-log-when-customer-changed-address.event";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should notify customer created event handler", async () => {
    const eventHandler = new SendConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    Customer.addDomainEvent("CustomerCreatedEvent", eventHandler)
    const customer = new Customer("1", "Customer 1");
    expect(spyEventHandler).toHaveBeenCalled();
  })

  it("should notify when customer change address event handler", async () => {
    const eventHandler = new SendConsoleLogWhenCustomerChangedAddress();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    Customer.addDomainEvent("CustomerAddressChangedEvent", eventHandler)
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);
    expect(spyEventHandler).toHaveBeenCalled();
  })
});
