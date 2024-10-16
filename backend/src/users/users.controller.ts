import {
  Controller,
  Post,
  Body,
  Put,
  NotFoundException,
  Request,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { User } from './user.entity';
import { DeleteAccountDto } from './dto/delete-account.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Dados do usuário',
    description: 'Retorna os dados do usuário logado.',
  })
  @ApiBearerAuth('access-token')
  @Get()
  async get(@Request() req) {
    return this.usersService.getUser(req.user.sub);
  }

  @ApiOperation({
    summary: 'Criar um novo usuário',
    description:
      'Cria um novo usuário na plataforma. Se os dados forem válidos, o usuário será registrado e poderá fazer login na plataforma.',
  })
  @ApiBody({ type: CreateUserDto, description: 'Request body.' })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Atualiza as informações do usuário',
    description:
      'Atualiza as informações de um usuário existente. A rota requer autenticação e só permite a atualização dos dados do próprio usuário.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Request body for updating user.',
  })
  @ApiBearerAuth('access-token')
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.update(req.user.sub, updateUserDto);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @ApiOperation({
    summary: 'Desativar conta de usuário',
    description:
      'Permite que o usuário autenticado desative sua conta, inativando-a no sistema. Exige a senha para confirmação.',
  })
  @ApiBody({ type: DeleteAccountDto })
  @ApiBearerAuth('access-token')
  @Delete('inactivate')
  async deactivateUser(
    @Request() req,
    @Body('password') password: string,
  ): Promise<{ message: string }> {
    await this.usersService.deactivateUser(req.user.sub, password);

    return { message: 'Conta desativada com sucesso.' };
  }
}
