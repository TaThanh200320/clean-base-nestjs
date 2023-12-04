import {
    FilterQuery,
    Model,
    ProjectionType,
    QueryOptions,
    SaveOptions,
    Types,
    UpdateQuery,
} from 'mongoose';
import { FindAllResponse, PaginateParams } from '@common/types.common';

import { BaseEntity } from '@models/base.entity';
import { BaseRepositoryInterface } from './base-repository.interface';

export abstract class BaseRepository<T extends BaseEntity>
    implements BaseRepositoryInterface<T>
{
    protected constructor(private readonly model: Model<T>) {}

    async create(
        document: Omit<T, '_id'> | any,
        saveOptions?: SaveOptions,
    ): Promise<T> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });

        return (await createdDocument.save(saveOptions)) as T;
    }

    async findAll(
        filterQuery: FilterQuery<T>,
        paginateParams?: PaginateParams,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<FindAllResponse<T>> {
        const offset = paginateParams?.offset;
        const limit = paginateParams?.limit;

        const [count, items] = await Promise.all([
            this.model
                .countDocuments(filterQuery)
                .sort({ createAt: -1 })
                .skip(Number(0 * Number.MAX_SAFE_INTEGER))
                .limit(Number.MAX_SAFE_INTEGER),
            this.model
                .find(filterQuery, projection, options)
                .sort({ createAt: -1 })
                .skip(Number(offset * limit))
                .limit(Number(limit)),
        ]);

        return {
            count,
            items,
        };
    }

    async findOne(
        filterQuery: FilterQuery<T>,
        projection?: ProjectionType<T>,
        option?: QueryOptions<T>,
    ): Promise<T> {
        return await this.model.findOne(
            {
                ...filterQuery,
                isDeleted: false,
            },
            projection,
            option,
        );
    }

    async findOneById(
        id: string,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<T> {
        return await this.model.findById(id, projection, options);
    }

    async update(
        filterQuery: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions,
    ): Promise<T> {
        await this.model
            .updateOne({ ...filterQuery, isDeleted: false }, update, options)
            .exec();
        return await this.model.findOne(filterQuery);
    }

    async updateById(id: string, dto: Partial<T>): Promise<T> {
        await this.model
            .updateOne({ _id: id, isDeleted: false }, dto, {
                new: true,
            })
            .exec();
        return await this.model.findById(id);
    }

    async updateByEmail(email: string, dto: Partial<T>): Promise<T> {
        await this.model
            .updateOne({ email: email, isDeleted: false }, dto, {
                new: true,
            })
            .exec();
        return await this.model.findOne({ email });
    }

    async restoreSoftDeleted(id: string): Promise<boolean> {
        const softDeletedDocument = await this.model.findOne<T>({
            _id: id,
            isDeleted: false,
        });

        if (softDeletedDocument) {
            return false;
        }

        return !!(await this.model
            .findByIdAndUpdate<T>(id, { isDeleted: false })
            .exec());
    }

    async softDelete(id: string): Promise<boolean> {
        const deletedDocument = await this.model.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!deletedDocument) {
            return false;
        }

        return !!(await this.model
            .findByIdAndUpdate<T>(id, { isDeleted: true })
            .exec());
    }

    async permanentlyDelete(id: string): Promise<boolean> {
        const deletedDocument = await this.model.findById(id);
        if (!deletedDocument) {
            return false;
        }
        return !!(await this.model.findOneAndDelete({ _id: id }));
    }
}
