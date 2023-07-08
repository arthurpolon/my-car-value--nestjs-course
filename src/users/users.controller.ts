import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
} from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dtos/update-user.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto'
import { AuthService } from './auth.service'
import { SigninUserDto } from './dtos/signin-user.dto'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from './user.entity'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  async whoAmI(@CurrentUser() user: User) {
    return user
  }

  @Post('signout')
  async signOut(@Session() session: any) {
    session.userId = null
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('signin')
  async signin(@Body() body: SigninUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id))

    if (!user) throw new NotFoundException('User not found.')

    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body)
  }
}
