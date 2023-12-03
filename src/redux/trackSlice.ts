import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../utils/interfaces'
import { fetchTracks } from '../utils/queries'
import { TRACKS_PER_PAGE } from '../config'

export interface TracksState {
  allTracks: Track[]
  pageTracks: Track[]
  selectedTrack?: Track
  currentPage: number
  statuses: {
    allTracks: {
      loading: boolean
      error?: string
    }
  },
}

const initialState: TracksState = {
  statuses: {
    allTracks: {
      loading: false,
      error: undefined
    }
  },
  allTracks: [],
  pageTracks: [],
  selectedTrack: undefined,
  currentPage: 1
}

export const fetchAllTracks = createAsyncThunk('tracks/fetchAll', async () => {
  const tracks = await fetchTracks(1, 10000)
  console.log('tracks: ', tracks)
  return tracks
});

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    selectTrack: (state, action: PayloadAction<Track>) => {
      state.selectedTrack = action.payload
    },
    changePage: (state, action: PayloadAction<number>) => {
      const pageNumber = action.payload
      if (pageNumber > 0 && state.allTracks.length < (pageNumber * TRACKS_PER_PAGE - TRACKS_PER_PAGE)) {
        state.currentPage = pageNumber

        if (pageNumber === 1) {
          state.pageTracks = state.allTracks.slice(0, TRACKS_PER_PAGE)
        }
        else {
          state.pageTracks = state.allTracks.slice(pageNumber * TRACKS_PER_PAGE - (TRACKS_PER_PAGE - 1), pageNumber * TRACKS_PER_PAGE)
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTracks.pending, (state) => {
        state.statuses.allTracks.loading = true;
        state.statuses.allTracks.error = null;
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.statuses.allTracks.loading = false;
        state.allTracks = action.payload;
        state.pageTracks = state.allTracks.slice(0, TRACKS_PER_PAGE)
      })
      .addCase(fetchAllTracks.rejected, (state, action) => {
        state.statuses.allTracks.loading = false;
        state.statuses.allTracks.error = action.error.message;
      });
  }
})

// Action creators are generated for each case reducer function
export const { changePage, selectTrack } = counterSlice.actions

export default counterSlice.reducer