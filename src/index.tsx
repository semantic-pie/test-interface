import { render } from "preact"
import "./styles/style.css"
import UserAuth from "./components/user-auth"
import Player from "./components/player"
import TracksList from "./components/tracks-list"
import store from "./redux/store"
import { TRACKS_PER_PAGE } from "./config"
import { Provider } from "react-redux"
import { useEffect } from "preact/hooks"
import Control from "./components/control"
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { fetchAllTracks } from "./redux/thunks"
import { changePage, changeQuery, search, selectTrack } from "./redux/slices/trackSlice"

function getLastPage(totalItems: number): number {
  return Math.ceil(totalItems / TRACKS_PER_PAGE)
}

export function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export function App() {
  const selectedTrack = useAppSelector(
    state => state.tracks.selectedTrack
  )
  const pageTracks = useAppSelector(state => state.tracks.pageTracks)

  const currentPage = useAppSelector(
    state => state.tracks.currentPage
  )
  const maxPage = useAppSelector(state =>
    getLastPage(
      state.tracks.buttons.liked
        ? state.tracks.allTracks.filter((t) => t.liked).length
        : state.tracks.allTracks.length
    )
  )
  const query = useAppSelector(state => state.tracks.search.query)

  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.user.auth)

  useEffect(() => {
    dispatch(fetchAllTracks())
  }, [dispatch, auth.username])

  return (
    <div class="boxer" style={{ width: "fit-content" }}>
      <h1>Test interface</h1>

      <div style={{ display: "flex" }}>
        <UserAuth />
      </div>

      <Search query={query} />
      <section style={{ display: "flex", gap: "2px" }}>
        {auth.authenticated && <Control />}

        {selectedTrack && <Player currentTrack={selectedTrack} />}
        {pageTracks.length > 0 && (
          <TracksList
            tracks={pageTracks}
            setCurrentTrack={(track) => dispatch(selectTrack(track))}
            currentPage={currentPage}
            maxPage={maxPage}
            changePage={(page) => dispatch(changePage(page))}
          />
        )}
      </section>
    </div>
  )
}

const Search = (props: { query: string }) => {
  const dispatch = useAppDispatch()
  const query = useAppSelector(state => state.tracks.search.query)

  useEffect(() => {
    dispatch(search(query))
  }, [query])
  return (
    <div class="boxer">
      <div
        style={{ display: "flex", gap: "5px", justifyContent: "space-between" }}
      >
        <input
          onChange={(e) => dispatch(changeQuery(e.currentTarget.value))}
          value={query}
          style={{ width: "100%" }}
        />
        <button>Search</button>
      </div>
    </div>
  )
}

render(<AppWrapper />, document.getElementById("app"))
