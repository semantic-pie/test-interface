import { render } from "preact"
import "./styles/style.css"
import UserAuth from "./components/user-auth"
import Player from "./components/player"
import TracksList from "./components/tracks-list"
import { useSelector, useDispatch } from "react-redux"
import store, { AppDispatch, RootState } from "./redux/store"
import {
  changePage,
  changeQuery,
  fetchAllTracks,
  search,
  selectTrack,
} from "./redux/trackSlice"
import { TRACKS_PER_PAGE } from "./config"
import { Provider } from "react-redux"
import { useEffect } from "preact/hooks"
import Control from "./components/control"

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
  const selectedTrack = useSelector(
    (state: RootState) => state.tracks.selectedTrack
  )
  const pageTracks = useSelector((state: RootState) => state.tracks.pageTracks)

  const currentPage = useSelector(
    (state: RootState) => state.tracks.currentPage
  )
  const maxPage = useSelector((state: RootState) =>
    getLastPage(
      state.tracks.buttons.liked
        ? state.tracks.allTracks.filter((t) => t.liked).length
        : state.tracks.allTracks.length
    )
  )
  const query = useSelector((state: RootState) => state.tracks.search.query)

  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.user.auth)

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
  const dispatch = useDispatch()
  const query = useSelector((state: RootState) => state.tracks.search.query)

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
