import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetAllObjectsParamsDto {
  @IsOptional()
  @IsInt({ message: 'must be an integer' })
  page?: number;

  @IsOptional()
  @IsInt({ message: 'must be an integer' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'must be a string' })
  order?: string;

  @IsOptional()
  @IsString({ message: 'must be a string' })
  order_by?: string;

  @IsOptional()
  @IsBoolean({ message: 'must be a boolean' })
  include_child?: boolean;
}
