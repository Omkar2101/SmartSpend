import { UserRepository }
from "./user.repository";

export class UserService {

  private userRepository =
    new UserRepository();

  async findOrCreateUser(
    data: {
      clerkId: string;
      email: string;
    }
  ) {

    const existingUser =
      await this.userRepository
        .findByClerkId(
          data.clerkId
        );

    if (existingUser) {
      return existingUser;
    }

    return this.userRepository
      .createUser({
        clerkId: data.clerkId,
        email: data.email,
        name:data.email.split("@")[0],
      });
  }
}