import { api } from "./api";
import { User } from "../types";

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<Partial<User>, Partial<User>>({
      query: body => ({
        url: "/auth/register",
        method: "post",
        body,
      }),
    }),
    login: builder.mutation<
      Partial<User>,
      { usernameOrEmail: string; password: string }
    >({
      query: body => ({
        url: "/auth/login",
        method: "post",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "post",
      }),
    }),
    getMe: builder.query<Partial<User>, void>({
      query: () => ({
        url: "/auth/me",
        method: "get",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;

export const {
  endpoints: { register, login, logout, getMe },
} = authApi;
