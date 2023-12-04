import {
    FilterQuery,
    ProjectionType,
    QueryOptions,
    SaveOptions,
    UpdateQuery,
} from 'mongoose';
import { FindAllResponse, PaginateParams } from '@common/types.common';

import { BaseEntity } from '@models/base.entity';
import { BaseRepositoryInterface } from 'src/repositories/base/base-repository.interface';
import { BaseServiceInterface } from './base-service.interface';

export abstract class BaseService<Document extends BaseEntity>
    implements BaseServiceInterface<Document>
{
    constructor(
        private readonly repository: BaseRepositoryInterface<Document>,
    ) {}

    async create(
        document: Omit<Document, '_id'> | any,
        saveOptions?: SaveOptions,
    ): Promise<Document> {
        return await this.repository.create(document, saveOptions);
    }

    async findAll(
        filterQuery: FilterQuery<Document>,
        paginateParams?: PaginateParams,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<FindAllResponse<Document>> {
        return this.repository.findAll(
            filterQuery,
            paginateParams,
            projections,
            options,
        );
    }

    async findOne(
        filterQuery: FilterQuery<Document>,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document> {
        return this.repository.findOne(filterQuery, projections, options);
    }

    async findOneById(
        id: string,
        projections?: ProjectionType<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document> {
        return this.repository.findOneById(id, projections, options);
    }

    async update(
        filterQuery: FilterQuery<Document>,
        update: UpdateQuery<Document>,
        options?: QueryOptions<Document>,
    ): Promise<Document> {
        return this.repository.update(filterQuery, update, options);
    }

    async updateById(
        id: string,
        document: Partial<Document>,
    ): Promise<Document> {
        return this.repository.updateById(id, document);
    }
    async softDelete(id: string): Promise<boolean> {
        return await this.repository.softDelete(id);
    }

    async restoreSoftDeleted(id: string): Promise<boolean> {
        return await this.repository.restoreSoftDeleted(id);
    }

    async permanentlyDelete(id: string): Promise<boolean> {
        return await this.repository.permanentlyDelete(id);
    }
}
