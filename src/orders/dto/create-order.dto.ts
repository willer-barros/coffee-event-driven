import { IsString, IsUUID, IsArray, ValidateNested, IsInt, Min, ArrayMinSize, IsIn, isUUID } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto{
    @IsUUID('4', {message: 'O ID do produto deve ser um UUID valido'})
    productId: string;

    @IsInt({message: "A quantidade deve ser um numero inteiro"})
    @Min(1, {message: "A quanhtidade minima para cada item deve ser 1"})
    quantity: number;
}

export class CreateOrderDto{
    @IsUUID('4', {message: 'O ID do cliente deve ser um UUID valido'})
    clientId: string;

    @IsArray({ message: 'Os itens do pedido devem ser uma lista'})
    @ArrayMinSize(1,{message: 'O pedido deve conter pelo menos um item'})
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

}