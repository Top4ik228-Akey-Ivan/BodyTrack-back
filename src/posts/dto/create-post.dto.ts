import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PostFileDto {
  @IsString()
  url: string;
  @IsEnum(['VIDEO', 'IMAGE', 'OTHER'])
  type: 'IMAGE' | 'VIDEO' | 'OTHER';
}

export class CreatePostDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostFileDto)
  files: PostFileDto[];
}
