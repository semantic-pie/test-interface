import { FunctionComponent } from "preact"
import { HTMLProps } from "preact/compat"
import { useAppSelector } from "../redux/hooks"
import { Track } from "../redux/interfaces"
import { TRACKS_PER_PAGE } from "../config"

type TracksListProps = {
  tracks: Track[]
  setCurrentTrack: (t: Track) => void
  currentPage: number
  maxPage: number
  changePage: (page: number) => void
}

const TracksList = (props: TracksListProps) => {
  const control = useAppSelector(state => state.tracksSlice.control)

  let tracks: Track[] = []

  if (props.currentPage === 1) {
    tracks = props.tracks.slice(0, TRACKS_PER_PAGE)
  }
  else {
    tracks = props.tracks.slice(props.currentPage * TRACKS_PER_PAGE - (TRACKS_PER_PAGE), props.currentPage * TRACKS_PER_PAGE)
  }
  return (
    <div class="boxer" style={{ width: "100%" }}>
      <h4 class="boxer-title">{control.likedList ? 'Liked tracks:' : control.playlist ? 'Playlist' : 'Tracks list:'}</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "0 3px",
        }}
      >
        {tracks.map((t) => (
          <TrackCard
            title={t.title}
            author={t.author}
            onClick={() => props.setCurrentTrack(t)}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "7px" }}>
        {props.currentPage - 1 > 0 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage - 1)}
          >
            -
          </div>
        )}
        {props.currentPage - 2 > 0 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage - 2)}
          >
            {props.currentPage - 2}
          </div>
        )}
        {props.currentPage - 1 > 0 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage - 1)}
          >
            {props.currentPage - 1}
          </div>
        )}
        <div class="pagination-button34" style={{ opacity: "0.5" }} disabled>
          {props.currentPage}
        </div>
        {props.maxPage - props.currentPage > 0 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage + 1)}
          >
            {props.currentPage + 1}
          </div>
        )}
        {props.maxPage - props.currentPage > 1 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage + 2)}
          >
            {props.currentPage + 2}
          </div>
        )}
        {props.maxPage - props.currentPage > 0 && (
          <div
            class="pagination-button34"
            onClick={() => props.changePage(props.currentPage + 1)}
          >
            +
          </div>
        )}
      </div>
    </div>
  )
}

type TrackProps = { title: string; author: string }
const TrackCard: FunctionComponent<HTMLProps<HTMLDivElement> & TrackProps> = ({
  title,
  author,
  ...props
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      border: "1px solid black",
      padding: "2px",
      cursor: "pointer",
    }}
    onClick={props.onClick}
  >
    <span>{title}</span>
    <span style={{ opacity: "0.5" }}>{author}</span>
  </div>
)
export default TracksList
