import { render } from "preact"
import "./styles/style.css"
import UserAuth from "./components/user-auth"
import Player from "./components/player"
import TracksList from "./components/tracks-list"
import store from "./redux/store"
import { Provider } from "react-redux"
import { useEffect, useState } from "preact/hooks"
import Control from "./components/control"
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { fetchAllTracks } from "./redux/thunks"
import {
  changePage,
  selectTrack,
} from "./redux/slices/trackSlice"
import Search from "./components/search"
import { getLastPage } from "./utils/helpers"

export function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export function App() {
  const dispatch = useAppDispatch()

  const track = useAppSelector((state) => state.tracksSlice.current.track)
  const currentPage = useAppSelector((state) => state.tracksSlice.current.page)
  const pageTracks = useAppSelector((state) => state.tracksSlice.current.tracks)
  const maxPage = useAppSelector((state) =>
    getLastPage(state.tracksSlice.current.tracks.length)
  )

  const { authenticated, username } = useAppSelector(
    (state) => state.userSlice.auth
  )

  const [lastUpdate, setLastUpadte] = useState<Date>()

  useEffect(() => {
    console.log('use effect')
    if (!lastUpdate || Date.now() - lastUpdate.getTime() > 2000 ) {
      console.log('fetch')
      console.log('username: ', username)
      dispatch(fetchAllTracks())
      setLastUpadte(new Date())
    }
  }, [username])

  return (
    <div class="boxer" style={{ width: "fit-content" }}>
      <h1>Pie Tunes</h1>

      <div style={{ display: "flex" }}>
        <UserAuth />
      </div>

      <Search />
      <section style={{ display: "flex", gap: "2px" }}>
        {authenticated && <Control />}

        {track && <Player currentTrack={track} />}
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

render(<AppWrapper />, document.getElementById("app"))
