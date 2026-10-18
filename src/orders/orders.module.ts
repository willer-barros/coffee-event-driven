import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./orders.service.js";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['localhost:9092']
                    },
                    consumer:{
                        groupId: 'order-service-group',
                    },
                },
            },
        ]),
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})

export class OrdersModule{}