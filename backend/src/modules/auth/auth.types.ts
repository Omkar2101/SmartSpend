export interface CreateUserDto {
  clerkId: string;
  email: string;
  name?: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
}
