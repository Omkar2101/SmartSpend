import prisma from "../../config/prisma";
import { CreateUserDto } from "./auth.types";

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: CreateUserDto) {
        return prisma.user.create({
            data,
        });
    }

    async getAllUsers() {
        return prisma.user.findMany();
    }
}
