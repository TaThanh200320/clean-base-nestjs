import {
    IsEmail,
    IsNotEmpty,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';
export class SignUpDto {
    @IsNotEmpty({ message: 'Email cannot be empty!!' })
    @MaxLength(50, { always: true })
    @IsEmail({}, { message: 'Email is invalid!!' })
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
