import { render } from "preact"
import "./style.css"
import { useEffect, useState } from "preact/hooks"
import UserAuth from "./components/user-auth"
import Player from "./components/player"
import TracksList from "./components/tracks-list"
import { Track } from "./interfaces"
import { fetchTracks } from "./queries"

// const PAGE_SIZE = 10

export function App() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track>()

  const [currentPage, setCurrentPage] = useState(1)
  const toPage = (page: number) =>
    setCurrentPage((prev) => (page > 0 ? page : prev))

  const onCurrentTrackChange = (t: Track) => {
    setCurrentTrack(t)
  }

  useEffect(() => {
    console.log("update tracks")
    fetchTracks(
      1,
      10000
    ).then((tracks) => setTracks(tracks))
  }, [])

  console.log("tracks: ", tracks)
  return (
    <div class="boxer" style={{ width: "fit-content" }}>
      <h1>Test interface</h1>
      <div style={{ display: "flex" }}>
        <UserAuth />
      </div>
      <Search />
      <section style={{ display: "flex", gap: "2px" }}>
        <Control />
        {currentTrack && <Player currentTrack={currentTrack} />}
        {tracks.length > 0 && (
          <TracksList
            tracks={tracks}
            setCurrentTrack={onCurrentTrackChange}
            currentPage={currentPage}
            toPage={toPage}
          />
        )}
      </section>
    </div>
  )
}

const Search = () => {
  return (
    <div class="boxer">
      <div
        style={{ display: "flex", gap: "5px", justifyContent: "space-between" }}
      >
        <input type="input" value="" style={{ width: "100%" }} />
        <button>Search</button>
      </div>
    </div>
  )
}

const Control = () => {
  return (
    <div class="boxer">
      <h4 class="boxer-title" style={{minWidth: '100px'}}>Controls</h4>
      <button>generate playlist</button>
      <button>open playlist</button>
      <button>liked</button>
    </div>
  )
}

render(<App />, document.getElementById("app"))
