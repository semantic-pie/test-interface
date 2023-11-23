import { useEffect, useRef } from "preact/hooks"
import { Track } from "../interfaces"
import { DOWNLOAD_TRACK_URL } from "../config"
import { setCover } from "../util"



type PlayerProps = {
  currentTrack: Track
}

const Player = (props: PlayerProps) => {
  const audio = useRef<HTMLAudioElement>(null)
  const cover = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (props.currentTrack) {
      const url = DOWNLOAD_TRACK_URL + '/' + props.currentTrack.hash
      audio.current.crossOrigin = 'anonymous';
      audio.current.src = url
      setCover(url, cover)
      audio.current.play()
    }

  }, [props.currentTrack])

  return (
    <div class="boxer" style={{ justifyContent: "center", width: '300px'}}>
      <h4 class="boxer-title">Player</h4>

        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              ref={cover}
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "white",
              }}
            ></img>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <span>{props.currentTrack.title}</span>
            <span>{props.currentTrack.author}</span>
          </div>

          <audio ref={audio} id="audioPlayer" controls>
            Your browser does not support the audio tag.
          </audio>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0px 80px",
            }}
          >
            <button>prev</button>

            <button>like</button>

            <button>next</button>
          </div>
        </>
    </div>
  )
}

export default Player
