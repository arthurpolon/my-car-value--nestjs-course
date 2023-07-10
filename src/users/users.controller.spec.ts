import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { AuthService } from './auth.service'
import { NotFoundException } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      async findOne(id: number) {
        return { id, email: 'a@a.com', password: 'salt.hash' }
      },
      async find(email: string) {
        return [{ id: 1, email, password: 'salt.hash' }]
      },
      // async remove() {},
      // async update() {},
    }
    fakeAuthService = {
      // async signUp() {},
      async signIn(email: string, password: string) {
        return { id: 1, email, password }
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('a@a.com')

    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('a@a.com')
  })

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1')

    expect(user).toBeDefined()
    expect(user.id).toEqual(1)
  })

  it('findUser throws an error if user with the given id is not found', async () => {
    fakeUsersService.findOne = async () => null

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('signIn updates session object and returns user', async () => {
    const session = { userId: null }
    const user = await controller.signIn(
      { email: 'a@a.com', password: 'salt.hash' },
      session,
    )

    expect(user.id).toBeDefined()
    expect(session.userId).toEqual(user.id)
  })
})
