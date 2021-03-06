import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // create the obj to send
    const user = this.create({ username, password: hashedPassword });

    try {
      // send to server
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
