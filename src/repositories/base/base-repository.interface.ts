import {
    FilterQuery,
    ProjectionType,
    QueryOptions,
    SaveOptions,
    UpdateQuery,
} from 'mongoose';
import { FindAllResponse, PaginateParams } from '@common/types.common';

export interface BaseRepositoryInterface<T> {
    create(
        document: Omit<T, '_id'> | any,
        saveOptions?: SaveOptions,
    ): Promise<T>;

    findAll(
        filterQuery: FilterQuery<T>,
        paginateParams?: PaginateParams,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<FindAllResponse<T>>;

    findOne(
        filterQuery: FilterQuery<T>,
        projection?: ProjectionType<T>,
        option?: QueryOptions<T>,
    ): Promise<T>;

    findOneById(
        id: string,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<T>;

    update(
        filterQuery: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<T>;

    updateById(id: string, document: Partial<T>): Promise<T>;

    updateByEmail(email: string, document: Partial<T>): Promise<T>;

    softDelete(id: string): Promise<boolean>;

    restoreSoftDeleted(id: string): Promise<boolean>;

    permanentlyDelete(id: string): Promise<boolean>;
}
