import { configureStore } from '@reduxjs/toolkit'
import trackSlice from './slices/trackSlice'
import userSlice from './slices/userSlice'


const store = configureStore({
  reducer: {
    tracks: trackSlice,
    user: userSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
