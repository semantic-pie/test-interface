import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

export interface UserAuthData {
  username: string,
  password: string
}

type ROLE = 'ROLE_ADMIN' | 'ROLE_USER'

export interface UserSignUpData {
  username: string,
  password: string,
  userRole: ROLE,
  favoriteGenres: { name: string, weight: number }[]
}

export interface UserLogInData {
  username: string,
  password: string,
}

interface AuthResponse {
  token: string
}

interface AuthBadResponse {
  message: string
}

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

export const auth = createAsyncThunk('user/auth', async (userData: UserAuthData, { rejectWithValue }) => {
  return fetch('http://localhost:8080/api/v1/derezhor/auth', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((response) => {
      if (response.ok)
        return response.json() as Promise<AuthResponse>
      throw new Error('Errorrrrrrr');
    })
});

export const signUp = createAsyncThunk('user/signup', async (userData: UserSignUpData, { rejectWithValue }) => {
  return fetch('http://localhost:8080/api/v1/derezhor/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then((response) => {
      if (response.ok)
        return response.json() as Promise<AuthResponse>
      throw new Error('Errorrrrrrr');
    })
});


// export const logIn = createAsyncThunk('user/auth', async (userData: UserAuthData): Promise<UserLogInData> => {
//  return fetch('http://localhost:8060/api/v1/derezhor/auth', { body: JSON.stringify(userData) }).then(data => data.json())
// });

// export const signUp = createAsyncThunk('user/auth', async (userData: UserAuthData): Promise<AuthResponse> => {
//  return fetch('http://localhost:8060/api/v1/derezhor/auth', { body: JSON.stringify(userData) }).then(data => data.json())
// });


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
      }),
      builder
        .addCase(signUp.fulfilled, (state, action) => {
          state.auth.message = undefined
        })
  }
})

export const { tryAuth, logout } = userSlice.actions

export default userSlice.reducer