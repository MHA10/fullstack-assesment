import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto';
import { User } from '../entity/user.entity';
import {
  ApiUsersController,
  ApiGetAllUsers,
  ApiGetUserById,
  ApiCreateUser,
} from '../decorators/swagger.decorators';

@ApiUsersController()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiGetAllUsers()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiGetUserById()
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
