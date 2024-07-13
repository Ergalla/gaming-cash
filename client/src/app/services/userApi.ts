import { api } from "./api";
import { User } from "../types";

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    getUserById: builder.query<Partial<User>, number>({
      query: id => ({
        url: `/users/${id}`,
        method: "get",
      }),
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;

export const {
  endpoints: { getUserById },
} = userApi;
