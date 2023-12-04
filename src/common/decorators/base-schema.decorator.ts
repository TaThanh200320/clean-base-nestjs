import { Schema } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { applyDecorators } from '@nestjs/common';

export const BaseSchema = (options?: SchemaOptions) =>
    applyDecorators(
        Schema({
            strict: true,
            timestamps: {
                createdAt: 'createAt',
                updatedAt: 'updateAt',
            },
            toJSON: {
                virtuals: true,
            },
            toObject: {
                virtuals: true,
            },
            ...options,
        }),
    );
