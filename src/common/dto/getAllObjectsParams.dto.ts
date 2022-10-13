export class GetAllObjectsParamsDto {
  page?: number;
  limit?: number;
  order?: string;
  order_by?: string;
  include_child?: boolean;
}
