import { IsEnum, IsOptional, IsString } from 'class-validator';

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
}
