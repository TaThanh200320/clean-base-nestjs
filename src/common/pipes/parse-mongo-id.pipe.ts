import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId, isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, ObjectId[]> {
    transform(value: any): ObjectId[] {
        if (!value) {
            throw new BadRequestException('Invalid ID');
        }

        if (isObjectIdOrHexString(value)) {
            return value;
        }
        throw new BadRequestException('Invalid ID');
    }
}
