import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class NewObjectParamsDto {
  @IsNotEmpty({ message: 'can not be empty' })
  @IsString({ message: 'must be a string' })
  fileType: string;

  @IsNotEmpty({ message: 'can not be empty' })
  @IsString({ message: 'must be a string' })
  originalname: string;

  @IsOptional()
  @IsBoolean({ message: 'must be a boolean value' })
  optimize?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'must be a boolean value' })
  resize?: boolean;

  @IsOptional()
  @IsString({ message: 'must be a string' })
  size?: string;

  @IsOptional()
  @IsInt({ message: 'must be an integer' })
  @Max(100, { message: 'can not be more than 100' })
  @Min(1, { message: 'can not be less than 1' })
  quality?: number;
}
