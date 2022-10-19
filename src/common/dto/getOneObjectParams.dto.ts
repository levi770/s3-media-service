import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetOneObjectParamsDto {
  @IsOptional()
  @IsString({ message: 'must be a string' })
  id?: string;

  @IsOptional()
  @IsString({ message: 'must be a string' })
  key?: string;

  @IsOptional()
  @IsBoolean({ message: 'must be a boolean' })
  include_child?: boolean;
}
