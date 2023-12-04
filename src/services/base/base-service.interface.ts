import {
    FilterQuery,
    ProjectionType,
    QueryOptions,
    SaveOptions,
    UpdateQuery,
} from 'mongoose';
import { FindAllResponse, PaginateParams } from '@common/types.common';

export interface Write<Document> {
    create(
        document: Omit<Document, '_id'> | any,
        saveOptions: SaveOptions,
    ): Promise<Document>;

    update(
        filterQuery: FilterQuery<Document>,
        update: UpdateQuery<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document>;

    updateById(id: string, document: Partial<Document>): Promise<Document>;

    restoreSoftDeleted(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
}

export interface Read<Document> {
    findAll(
        filterQuery: FilterQuery<Document>,
        paginateParams?: PaginateParams,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<FindAllResponse<Document>>;

    findOneById(
        id: string,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document>;

    findOne(
        filterQuery: FilterQuery<Document>,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document>;
}

export interface BaseServiceInterface<Document>
    extends Write<Document>,
        Read<Document> {}
