import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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

    return {
      message: 'Pedido criado com sucesso!',
      order,
    };
  }
}