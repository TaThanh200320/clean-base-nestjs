import {
    IsEmail,
    IsNotEmpty,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail(
        {},
        {
            message: 'Email is invalid!',
        },
    )
    @MaxLength(50, { always: true })
    @IsNotEmpty({ message: 'Email cannot be empty!' })
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    })
    @IsNotEmpty({ message: 'Password cannot be empty!' })
    password: string;
}
