export class GetUploadUrlDto {
  fileType: string;
  originalname: string;
  optimize?: boolean;
  convert?: boolean;
  size?: string;
  quality?: string;
}
