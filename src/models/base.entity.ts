import { Expose, Transform } from 'class-transformer';
import { SchemaTypes, Types } from 'mongoose';

import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;

    @Expose()
    @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
    id?: string;

    @Prop({ default: false })
    isDeleted: boolean;
}
