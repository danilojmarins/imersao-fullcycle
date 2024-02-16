import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private amqpConnection: AmqpConnection,
  ) {}

  async create(createOrderDto: CreateOrderDto & { client_id: string }) {
    const productsIds = createOrderDto.items.map((item) => item.product_id);
    const uniqueProductIds = [...new Set(productsIds)];
    const products = await this.productRepository.findBy({
      id: In(productsIds),
    });

    if (products.length !== uniqueProductIds.length) {
      throw new HttpException(
        `Algum produto informado não existe`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = Order.create({
      client_id: createOrderDto.client_id,
      items: createOrderDto.items.map((item) => {
        const product = products.find(
          (product) => product.id === item.product_id,
        );
        return {
          quantity: item.quantity,
          product_id: product.id,
          price: product.price,
        };
      }),
    });

    await this.orderRepository.save(order);
    await this.amqpConnection.publish('amq.direct', 'OrderCreated', {
      order_id: order.id,
      card_hash: createOrderDto.card_hash,
      total: order.total,
    });
    return order;
  }

  async findAll(client_id: string) {
    return await this.orderRepository.find({ where: { client_id } });
  }

  async findOne(id: string, client_id: string) {
    return await this.orderRepository.findOneOrFail({
      where: { id, client_id },
      order: { created_at: 'DESC' },
    });
  }
}
