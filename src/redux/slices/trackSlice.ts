import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { logout } from './userSlice'
import { Genre, Track } from '../interfaces'
import { TRACKS_PER_PAGE } from '../../config'
import { dislikeTrack, fetchAllTracks, fetchPlaylist, likeTrack } from '../thunks'

export interface TracksState {
  tracks: {
    all: Track[]
    playlist: Track[]
  }

  statuses: {
    all: {
      loading: boolean,
      error?: string
    }
    playlist: {
      loading: boolean,
      error?: string
    }
  }

  searchQuery: string

  current: {
    tracks: Track[]
    track: Track
    page: number
  }

  control: {
    likedList: boolean
    playlist: boolean
  }
}

const initialState: TracksState = {
  tracks: { all: [], playlist: [] },
  statuses: {
    all: { loading: false },
    playlist: { loading: false }
  },

  searchQuery: '',

  current: {
    tracks: [],
    track: undefined,
    page: 1
  },

  control: {
    likedList: false,
    playlist: false
  }
}

export const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    changeQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    search: (state, action: PayloadAction<string>) => {
      if (action.payload.length > 0) {
        const query = action.payload.split(' ').filter(q => q.length)
        console.log(query)
        const result = []

        for (const track of state.current.tracks) {
          for (const subquery of query) {
            if (track.title?.includes(subquery)
              || track.author?.includes(subquery)
              || track.genre?.name.includes(subquery)) {
              result.push(track)
              break;
            }
          }
        }

        state.current.tracks = result
      } else {
        if (state.control.likedList)
          state.current.tracks = state.current.tracks.filter(t => t.liked)
        else if (state.control.playlist)
          state.current.tracks = state.tracks.playlist
        else
          state.current.tracks = state.tracks.all
      }
    },
    selectTrack: (state, action: PayloadAction<Track>) => {
      state.current.track = action.payload
    },
    toggleLikedTracks: (state) => {
      state.control.playlist = false
      state.control.likedList = !state.control.likedList

      if (state.control.likedList)
        state.current.tracks = state.tracks.all.filter(t => t.liked)
      else if (state.control.playlist)
        state.current.tracks = state.tracks.playlist
      else
        state.current.tracks = state.tracks.all
    },
    togglePlaylist: (state) => {
      state.control.likedList = false
      state.control.playlist = !state.control.playlist

      if (state.control.playlist)
        state.current.tracks = state.tracks.playlist
      else if (state.control.likedList)
        state.current.tracks = state.tracks.all.filter(t => t.liked)
      else
        state.current.tracks = state.tracks.all
    },
    changePage: (state, action: PayloadAction<number>) => {
      const pageNumber = action.payload
      const tracks = state.control.likedList ? state.current.tracks.filter(t => t.liked) : state.current.tracks

      if (pageNumber > 0 && tracks.length > (pageNumber * TRACKS_PER_PAGE - TRACKS_PER_PAGE)) {
        state.current.page = pageNumber

        // if (pageNumber === 1) {
        //   state.pageTracks = tracks.slice(0, TRACKS_PER_PAGE)
        // }
        // else {
        //   state.pageTracks = tracks.slice(pageNumber * TRACKS_PER_PAGE - (TRACKS_PER_PAGE), pageNumber * TRACKS_PER_PAGE)
        // }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTracks.pending, (state, action) => {
        state.statuses.all.loading = true
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.statuses.all.loading = false
        state.tracks.all = action.payload
        state.current.tracks = action.payload
        // state.genres = Array.from(new Set(state.allTracks.map(t => t.genre).filter(g => !!g && !!g.name).map(g => JSON.stringify(g)))).map(g => JSON.parse(g) as Genre);
        // state.pageTracks = state.allTracks.slice(0, TRACKS_PER_PAGE)
        // console.log('tracks: ', action.payload)
      })
      .addCase(fetchAllTracks.rejected, (state, action) => {
        state.statuses.all.loading = false;
        state.statuses.all.error = action.error.message;
        console.log('rejected: [fetchAllTracks]')
      })
      .addCase(logout, (state) => {
        state.tracks.all = state.tracks.all.map(t => ({ ...t, liked: false }))
        state.tracks.playlist = []

        state.control.likedList = false
        state.control.playlist = false
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.tracks.playlist = action.payload;
        state.current.tracks = action.payload;
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        console.log('rejected: [fetchPlaylist]')
      })
      .addCase(likeTrack.fulfilled, (state) => {
        const track = state.current.track
        if (!track.liked) {
          state.tracks.all = getUpdatedWithLikeTracks(track, true, state.tracks.all)
          state.tracks.playlist = getUpdatedWithLikeTracks(track, true, state.tracks.playlist)
          state.current.tracks = getUpdatedWithLikeTracks(track, true, state.current.tracks)

          if (state.control.likedList)
          state.current.tracks = state.tracks.all.filter(t => t.liked)
        }
      })
      .addCase(likeTrack.rejected, (state, action) => {
        console.log('rejected: [likeTrack]')
      })
      .addCase(dislikeTrack.fulfilled, (state, action) => {
        const track = state.current.track
        if (track.liked) {
          state.tracks.all = getUpdatedWithLikeTracks(track, false, state.tracks.all)
          state.tracks.playlist = getUpdatedWithLikeTracks(track, false, state.tracks.playlist)
          state.current.tracks = getUpdatedWithLikeTracks(track, false, state.current.tracks)

          if (state.control.likedList)
            state.current.tracks = state.tracks.all.filter(t => t.liked)
        }
      })
      .addCase(dislikeTrack.rejected, (state, action) => {
        console.log('rejected: [dislikeTrack]')
      })
  }
})

const getUpdatedWithLikeTracks = (track: Track, like: boolean, tracks: Track[]) => {
  const updatedTracks = tracks.filter(t => t.hash !== track.hash)
  if (updatedTracks.length !== tracks.length) {
    track.liked = like
    updatedTracks.push(track)
  }

      
  return updatedTracks
}

export const { changePage, selectTrack, toggleLikedTracks, togglePlaylist, search, changeQuery } = tracksSlice.actions

export default tracksSlice.reducer
