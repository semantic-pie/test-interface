import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Genre, Track } from '../utils/interfaces'
import { TRACKS_PER_PAGE } from '../config'
import Cookies from 'universal-cookie'
import axios, { AxiosHeaders } from 'axios'
import { logout } from './userSlice'


function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export interface TracksState {
  genres: Genre[]
  allTracks: Track[]
  pageTracks: Track[]
  selectedTrack?: Track
  currentPage: number
  search: {
    query: string
  }
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
  search: {
    query: ''
  },
  buttons: {
    liked: false
  },
  genres: [],
  allTracks: [],
  pageTracks: [],
  selectedTrack: undefined,
  currentPage: 1
}

export const fetchAllTracks = createAsyncThunk('tracks/fetchAll', async () => {
  const token = new Cookies().get('token')

  let headers: AxiosHeaders = new AxiosHeaders()
  if (token) headers.setAuthorization(`Bearer ${token}`)

  return axios.get(`http://localhost:8080/api/v1/derezhor/tracks?page=1&limit=1000`, { headers })
    .then(data => data.data as Track[])
});

export const likeTrack = createAsyncThunk('tracks/like', async (hash: string) => {
  const token = new Cookies().get('token')

  let headers: AxiosHeaders = new AxiosHeaders()
  if (token) headers.setAuthorization(`Bearer ${token}`)

  console.log('token: ', token)
  return axios.post(`http://localhost:8080/api/v1/derezhor/tracks/${hash}/like`, {}, { headers })
    .then(data => data.data)
});

export const dislikeTrack = createAsyncThunk(
  "tracks/dislike",
  async (hash: string) => {
    const token = new Cookies().get("token");

    let headers: AxiosHeaders = new AxiosHeaders();
    if (token) headers.setAuthorization(`Bearer ${token}`);

    console.log("token: ", token);
    return axios
      .post(
        `http://localhost:8080/api/v1/derezhor/tracks/${hash}/dislike`,
        {},
        { headers }
      )
      .then((data) => data.data);
  }
);

export const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    changeQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload
    },
    search: (state, action: PayloadAction<string>) => {
      if (action.payload.length > 0) {
        const query = action.payload.split(' ').filter(q => q.length)
        console.log(query)
        const result = []
  
        for (const track of state.allTracks) {
          for (const subquery of query) {
            if (track.title?.includes(subquery)
              || track.author?.includes(subquery)
              || track.genre?.name.includes(subquery)) { 
                result.push(track)
                break;
              }
          }
        }
  
        state.pageTracks = result
      } else {
        state.pageTracks = [...state.allTracks]
      }
      
    },
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
        state.genres = Array.from(new Set(state.allTracks.map(t => t.genre).filter(g => !!g && !!g.name).map(g => JSON.stringify(g)))).map(g => JSON.parse(g) as Genre);
        state.pageTracks = state.allTracks.slice(0, TRACKS_PER_PAGE)
        console.log('tracks: ', action.payload)
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
        }),
      builder.addCase(logout, (state) => {
        state.pageTracks = state.allTracks.map(t => ({ ...t, liked: false }))
        state.buttons.liked = false
      }),
      builder
      .addCase(dislikeTrack.fulfilled, (state, action) => {
        if (state.selectedTrack) {
          const updated = state.allTracks.filter(
            (t) => t.hash !== state.selectedTrack.hash
          );
          updated.push({ ...state.selectedTrack, liked: false });
          state.allTracks = updated;
          state.pageTracks = state.allTracks
            .filter((t) => t.liked)
            .slice(0, TRACKS_PER_PAGE);
        }
      })
      .addCase(dislikeTrack.rejected, (state, action) => {
        console.log(action);
        console.log("you like this track!");
      });
  }
})

export const { changePage, selectTrack, toggleLikedTracks, search, changeQuery } = trackSlice.actions

export default trackSlice.reducer


// liked: org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
//        org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@122dd, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230d, null, org.ostis.scmemory.websocketmemory.memory.element.ScNodeImpl@12309, org.ostis.scmemory.websocketmemory.memory.element.ScEdgeImpl@1230e, null]
