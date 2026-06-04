import { UserRepository } from "./user.repository";

export class UserService {
  private userRepository =
    new UserRepository();

  async syncUser(data: {
    clerkId: string;
    email: string;
    name?: string;
  }) {

    const existingUser =
      await this.userRepository.findByClerkId(
        data.clerkId
      );

    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.createUser(data);
  }
}