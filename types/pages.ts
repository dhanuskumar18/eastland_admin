export interface PageField {
  id?: number;
  key: string;
  en: string | null;
  pt: string | null;
}

export interface PageInfoMeta {
  id: number;
  name: string;
}

export interface PageContentData {
  page: PageInfoMeta;
  fields: PageField[];
}

export interface PageContentApiResponse {
  version: string;
  code: number;
  status: boolean;
  message: string;
  data: PageContentData;
}

export interface PagesListApiResponse {
  version: string;
  code: number;
  status: boolean;
  message: string;
  data: {
    pages: string[];
  };
}


