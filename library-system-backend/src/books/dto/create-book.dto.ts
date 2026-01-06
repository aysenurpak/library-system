import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  publishYear: number;

  @IsNumber()
  @Min(0)
  availableCopies: number;

  @IsNumber()
  @Min(0)
  totalCopies: number;

  @IsNumber()
  categoryId: number;

  @IsNumber({}, { each: true })
  authorIds: number[];
}
