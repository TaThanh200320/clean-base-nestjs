export enum SORT_TYPE {
    'DESC' = 'desc',
    'ASC' = 'acs',
}

export type ResponseMessage = {
    message: string;
};

export type FindAllResponse<Document> = {
    count: number;
    items: Document[];
};

export type SortParams = { sortBy: string; sortType: SORT_TYPE };

export type SearchParams = { keywork: string; field: string };

export type PaginateParams = {
    offset: number;
    limit: number;
};
