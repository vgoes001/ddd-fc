import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("123", "123", [ordemItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const productA = new Product("123", "Product 1", 10);
    const productB = new Product("1234", "Product 2", 20);
    await productRepository.create(productA);
    await productRepository.create(productB);
    const ordemItem1 = new OrderItem(
      "1",
      productA.name,
      productA.price,
      productA.id,
      2
    );
    const ordemItem2 = new OrderItem(
      "2",
      productB.name,
      productB.price,
      productB.id,
      5
    );
    const order = new Order("123", "123", [ordemItem1]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const changeOrder = await orderRepository.find(order.id);
    changeOrder.addItem(ordemItem2);
    await orderRepository.update(changeOrder)
    const sut = await orderRepository.find(order.id);
    expect(sut.items).toHaveLength(2)
    expect(sut.id).toBe(order.id)
    expect(sut.items[0].id).toBe("1")
    expect(sut.items[1].id).toBe("2")
  })


  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const productA = new Product("123", "Product 1", 10);
    const productB = new Product("1234", "Product 2", 20);
    await productRepository.create(productA);
    await productRepository.create(productB);
    const ordemItem1 = new OrderItem(
      "1",
      productA.name,
      productA.price,
      productA.id,
      2
    );
    const order = new Order("123", "123", [ordemItem1]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const orderResponse = await orderRepository.find(order.id);
    expect(orderResponse.id).toBe(order.id);
  })

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const productA = new Product("123", "Product 1", 10);
    const productB = new Product("1234", "Product 2", 20);
    await productRepository.create(productA);
    await productRepository.create(productB);
    const ordemItem1 = new OrderItem(
      "1",
      productA.name,
      productA.price,
      productA.id,
      2
    );
    const ordemItem2 = new OrderItem(
      "2",
      productB.name,
      productB.price,
      productB.id,
      5
    );
    const orderA = new Order("123", "123", [ordemItem1]);
    const orderB = new Order("1234", "123", [ordemItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(orderA);
    await orderRepository.create(orderB);
    const orders = await orderRepository.findAll();
    expect(orders).toHaveLength(2);
    expect(orders[0].id).toBe(orderA.id)
    expect(orders[1].id).toBe(orderB.id)

  })
});
