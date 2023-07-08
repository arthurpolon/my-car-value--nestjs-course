import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { User } from './user.entity'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []

    fakeUsersService = {
      async find(email: string) {
        return users.filter((user) => user.email === email)
      },

      async create(email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User
        users.push(user)
        return user
      },
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('a@a.com', 'myPassword')

    expect(user.password).not.toEqual('myPassword')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user signs up with email that is already in use', async () => {
    await service.signUp('a@a.com', 'myPassword')

    await expect(service.signUp('a@a.com', 'myPassword')).rejects.toThrow(
      BadRequestException,
    )
  })

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signIn('b@b.com', 'myPassword')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('throws if an invalid password is provided', async () => {
    await service.signUp('a@a.com', 'myPassword')

    await expect(
      service.signIn('a@a.com', 'differentPassword'),
    ).rejects.toThrow(ForbiddenException)
  })

  it('returns a user if correct password is provided', async () => {
    await service.signUp('a@a.com', 'myPassword')

    const user = await service.signIn('a@a.com', 'myPassword')

    expect(user).toBeDefined()
  })
})
