import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { Expose, Transform } from "class-transformer";
import { OrderBy } from "./order-by.enum";

export class Pagination {
	@ApiPropertyOptional({ enum: OrderBy, default: OrderBy.ASC })
	@IsEnum(OrderBy)
	@IsOptional()
	readonly order?: OrderBy = OrderBy.ASC;

	@ApiPropertyOptional({
		minimum: 1,
		default: 1,
		type: Number
	})
	// true / fale typeof boolean  string
	@Transform(({ value }) => parseInt(value))
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1;

	@ApiPropertyOptional({
		minimum: 1,
		maximum: 50,
		default: 10,
		type: Number,
	})
	@Transform(({ value }) => parseInt(value))
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	take?: number = 10;


	@ApiPropertyOptional({})
	search?: string;

	@Expose()
	get skip(): number {
		return (this.page - 1) * this.take;
	}
}
