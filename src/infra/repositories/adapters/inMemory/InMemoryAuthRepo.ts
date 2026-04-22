import { AuthUser } from '@/src/domain/auth/AuthUser';
import { AuthSignUpParams, IAuthRepo } from '@/src/domain/auth/IAuthRepo';
import { authUsers } from './data/authUsers';

export class InMemoryAuthRepo implements IAuthRepo {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const user = authUsers.find(user => user.email === email);
    if (user) {
      return user;
    }

    throw new Error('user not found');
  }

  async signOut(): Promise<void> {
    //
  }

  async signUp(params: AuthSignUpParams): Promise<void> {
    const userExists = authUsers.some(user => user.email === params.email);

    if (userExists) {
      throw new Error('user already exists');
    }

    authUsers.push({
      id: String(authUsers.length + 1),
      email: params.email,
      fullname: params.fullname,
      createdAt: new Date().toISOString(),
    });
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    console.log('the reset password has been sent:', email);
  }

  async getUser(): Promise<AuthUser> {
    return authUsers[0];
  }
}
