import { api } from "./client";

export const getCurrentUser =
  async (token: string) => {

    const response =
      await api.get(
        "/users/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };