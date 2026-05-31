import { AuthRepository } from "./auth.repository";
import { CreateUserDto } from "./auth.types";
import { AppError } from "../../errors/AppError";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async registerUser(data: CreateUserDto) {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }
    const user = await this.authRepository.createUser(data);
    return user;
  }

  async getUsers() {
    return this.authRepository.getAllUsers();
  }
}
