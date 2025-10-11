export class PostFileResponseDto {
  id: number;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'OTHER';
}

export class PostResponseDto {
  id: number;
  text: string | null;
  createdAt: Date;
  updatedAt: Date;
  files: PostFileResponseDto[];

  user: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
}
