import { configureStore } from '@reduxjs/toolkit'
import trackSlice from './trackSlice'

const store = configureStore({
  reducer: {
    tracks: trackSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
