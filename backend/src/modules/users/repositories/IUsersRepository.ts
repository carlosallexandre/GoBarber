import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User.model';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findAllProviders({ exceptUserId }: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: ICreateUserDTO): Promise<User>;
}
