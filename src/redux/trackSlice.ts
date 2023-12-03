import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../utils/interfaces'
import { TRACKS_PER_PAGE } from '../config'
import Cookies from 'universal-cookie'
import axios, { AxiosHeaders } from 'axios'

export interface TracksState {
  allTracks: Track[]
  pageTracks: Track[]
  selectedTrack?: Track
  currentPage: number
  buttons: {
    liked: boolean
  },
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
  buttons: {
    liked: false
  },
  allTracks: [],
  pageTracks: [],
  selectedTrack: undefined,
  currentPage: 1
}

export const fetchAllTracks = createAsyncThunk('tracks/fetchAll', async () => {
  const token = new Cookies().get('token')

  let headers: AxiosHeaders = new AxiosHeaders()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  return axios.get(`http://localhost:8080/api/v1/derezhor/tracks?page=1&limit=1000`, { headers })
    .then(data => data.data as Track[])
});

export const likeTrack = createAsyncThunk('tracks/like', async (hash: string) => {
  const token = new Cookies().get('token')

  let headers: AxiosHeaders = new AxiosHeaders()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  return axios.post(`http://localhost:8080/api/v1/derezhor/tracks/${hash}/like`, {}, { headers })
    .then(data => data.data)
});


export const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    selectTrack: (state, action: PayloadAction<Track>) => {
      state.selectedTrack = action.payload
    },
    toggleLikedTracks: (state) => {
      state.buttons.liked = !state.buttons.liked
      if (state.buttons.liked) {
        state.pageTracks = state.allTracks.filter(t => t.liked).slice(0, TRACKS_PER_PAGE)
      } else {
        state.pageTracks = state.allTracks.slice(0, TRACKS_PER_PAGE)
      }
    },
    changePage: (state, action: PayloadAction<number>) => {
      const pageNumber = action.payload

      const likedMode = state.buttons.liked

      const tracks = likedMode ? state.allTracks.filter(t => t.liked) : state.allTracks

      if (pageNumber > 0 && tracks.length > (pageNumber * TRACKS_PER_PAGE - TRACKS_PER_PAGE)) {
        state.currentPage = pageNumber

        if (pageNumber === 1) {
          state.pageTracks = tracks.slice(0, TRACKS_PER_PAGE)
        }
        else {
          state.pageTracks = tracks.slice(pageNumber * TRACKS_PER_PAGE - (TRACKS_PER_PAGE), pageNumber * TRACKS_PER_PAGE)
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
      }),
      builder
        .addCase(likeTrack.fulfilled, (state, action) => {
          if (state.selectedTrack) {
            const updated = state.allTracks.filter(t => t.hash !== state.selectedTrack.hash)
            updated.push({ ...state.selectedTrack, liked: true })
            state.allTracks = updated
          }
        })
        .addCase(likeTrack.rejected, (state, action) => {
          console.log(action)
          console.log('you don\'t like this track!')
        });
  }
})

export const { changePage, selectTrack, toggleLikedTracks } = trackSlice.actions

export default trackSlice.reducer


// liked: org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
