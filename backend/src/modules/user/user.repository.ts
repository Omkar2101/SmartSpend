import prisma from "../../config/prisma";

export class UserRepository {
  async findByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
  }

  async createUser(data: {
    clerkId: string;
    email: string;
    name?: string;
  }) {
    return prisma.user.create({
      data,
    });
  }
}