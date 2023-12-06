import { useEffect, useRef } from "preact/hooks"

import { DOWNLOAD_TRACK_URL } from "../config"
import { setCover } from "../utils/helpers"
import { dislikeTrack, likeTrack } from "../redux/trackSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { Track } from "../redux/interfaces"

type PlayerProps = {
  currentTrack: Track
}

const Player = (props: PlayerProps) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.user.auth)
  const likedTracks = useAppSelector(state => state.tracks.allTracks).filter(track => track.liked)
  const audio = useRef<HTMLAudioElement>(null)
  const cover = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (props.currentTrack) {
      const url = DOWNLOAD_TRACK_URL + "/" + props.currentTrack.hash
      audio.current.crossOrigin = "anonymous"
      audio.current.src = url
      setCover(url, cover)
      audio.current.play()
    }
  }, [props.currentTrack])

  return (
    <div class="boxer" style={{ justifyContent: "center", width: "300px" }}>
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

          {auth.authenticated && (
            <button
              onClick={() => likedTracks.includes(props.currentTrack) ? dispatch(dislikeTrack(props.currentTrack.hash)) : dispatch(likeTrack(props.currentTrack.hash))}
            >
              {likedTracks.includes(props.currentTrack) ? "dislike" : "like"}
            </button>
          )}

          <button>next</button>
        </div>
      </>
    </div>
  )
}

export default Player
