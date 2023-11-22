import { FunctionComponent } from "preact"
import { Track } from "../interfaces"
import { HTMLProps, useEffect, useState } from "preact/compat"

type TracksListProps = {
  tracks: Track[]
  setCurrentTrack: (t: Track) => void
  currentPage: number
  toPage: (page: number) => void
}

// 1 - 1 10
// 2 - 11 20
// 3 - 21 30

const PAGE_SIZE = 10



const TracksList = (props: TracksListProps) => {
  const [tracks, setTracks] = useState<Track[]>([])

  const kek = () => {
    return props.tracks.length - props.currentPage * PAGE_SIZE
  }

  useEffect(() => {
    console.log('kek')
    if (props.currentPage === 1) {
      setTracks(props.tracks.slice(0, PAGE_SIZE))
    }
    else {
      setTracks(props.tracks.slice(props.currentPage * PAGE_SIZE - (PAGE_SIZE-1), props.currentPage * PAGE_SIZE))
    }
    console.log('old: ', tracks)
    console.log('pages last: ', kek())
  }, [props.currentPage])

  return (
    <div class="boxer" style={{ width: "100%" }}>
      <h4 class="boxer-title">Track list:</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          padding: "0 3px",
        }}
      >
        {tracks.map((t) => (
          <TrackCard title={t.title} author={t.author} onClick={() => props.setCurrentTrack(t)} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '7px' }}>
        {props.currentPage - 1 > 0 && <div class='pagination-button34' onClick={() => props.toPage(props.currentPage - 1)}>-</div>}
        {props.currentPage - 2 > 0 && <div class='pagination-button34' onClick={() => props.toPage(props.currentPage - 2)}>{props.currentPage - 2}</div>}
        {props.currentPage - 1 > 0 && <div class='pagination-button34'onClick={() => props.toPage(props.currentPage - 1)}>{props.currentPage - 1}</div>}
        <div class='pagination-button34' style={{opacity: '0.5'}} disabled>{props.currentPage}</div>
        {kek() > 0 && <div class='pagination-button34' onClick={() => props.toPage(props.currentPage + 1)}>{props.currentPage + 1}</div>}
        {kek() > PAGE_SIZE && <div class='pagination-button34' onClick={() => props.toPage(props.currentPage + 2)}>{props.currentPage + 2}</div>}
        {kek() > 0 && <div class='pagination-button34' onClick={() => props.toPage(props.currentPage + 1)}>+</div>}
      </div>
    </div>
  ) // () => props.setCurrentTrack(t)
}

type TrackProps = { title: string, author: string }
const TrackCard: FunctionComponent<HTMLProps<HTMLDivElement> & TrackProps> = ({title, author, ...props}) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "4px", border: "1px solid black", padding: '2px', cursor: 'pointer'}}
    onClick={props.onClick}
  >
    <span>{title}</span>
    <span style={{opacity: '0.5'}}>{author}</span>
  </div>
)
export default TracksList
