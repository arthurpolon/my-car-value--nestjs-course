import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt, BinaryLike } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt) as (
  arg1: BinaryLike,
  arg2: BinaryLike,
  arg3: number,
) => Promise<Buffer>

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email)

    if (users.length) throw new BadRequestException('email already in use')

    // Hash users password
    // - Generate salt
    const salt = randomBytes(8).toString('hex')

    // - Hash the salt and password together
    const hash = (await scrypt(password, salt, 32)).toString('hex')

    // - Join hashed result and salt together
    const result = `${salt}.${hash}`

    // Create a new user
    const user = this.usersService.create(email, result)

    // return the user
    return user
  }

  signin() {}
}
