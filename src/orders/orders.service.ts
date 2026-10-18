import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(private prisma: PrismaService, 
  @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async create(createOrderDto: CreateOrderDto) {
    const { clientId, items } = createOrderDto;

    const orderTotal = 10.00; // Valor temporário para o exemplo

    const order = await this.prisma.order.create({
      data: {
        clientId,
        total: orderTotal,
        status: 'PENDING',
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true, 
      },
    });

    this.kafkaClient.emit('order.created',{
      orderId: order.id,
      clientId: order.clientId,
      total: order.total,
      items: order.orderItems,
      createdAt: order.createdAt,
    })

    return {
      message: 'Pedido criado com sucesso!',
      order,
    };
  }
}