import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import { auth, signUp } from '../thunks';

export interface UserState {
  auth: {
    authenticated: boolean,
    message?: string
    uuid?: string
    username?: string
  }
}

const initialState: UserState = {
  auth: {
    authenticated: false,
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      const cookies = new Cookies();
      cookies.remove('token')
      state.auth.authenticated = false
      state.auth.message = undefined
    },
    tryAuth: (state) => {
      console.log('[TRY AUTH]>')
      const cookies = new Cookies();
      const token = cookies.get('token')
      console.log('token: ', token)

      if (token) {
        const jwtPayload = jwtDecode<{ username: string, uuid: string }>(token)
        state.auth.username = jwtPayload.username
        state.auth.uuid = jwtPayload.uuid
        state.auth.authenticated = true
        state.auth.message = undefined
        console.log(`Token founded, user [${jwtPayload.username}] authenticated`)
      } else {
        console.log('Token NOT founded')
        state.auth.authenticated = false
        state.auth.message = undefined
      }
      console.log('[TRY AUTH]<')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(auth.fulfilled, (state, action) => {
        console.log('fulfilled: ', action.payload.token)
        const cookies = new Cookies();
        if (action.payload.token) {
          const cookies = new Cookies();
          cookies.remove('token')
          cookies.set('token', action.payload.token, { path: '/', expires: new Date(new Date().getTime() + (30 * 60 * 1000)) }); // 30 minutes expiration
          const jwtPayload = jwtDecode<{ username: string, uuid: string }>(action.payload.token)
          state.auth.username = jwtPayload.username
          state.auth.uuid = jwtPayload.uuid
          state.auth.authenticated = true
          state.auth.message = undefined
        }
      })
      .addCase(auth.rejected, (state, action) => {
        state.auth.message = 'Wrong password or username'
        state.auth.authenticated = false
      })
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.auth.message = undefined
      })
  }
})

export const { tryAuth, logout } = userSlice.actions

export default userSlice.reducer