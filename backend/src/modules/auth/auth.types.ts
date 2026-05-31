export interface CreateUserDto {
  email: string;
  name?: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
}
