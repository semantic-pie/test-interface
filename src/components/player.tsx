import { useEffect, useRef } from "preact/hooks"

import { DOWNLOAD_TRACK_URL } from "../config"
import { setCover } from "../utils/helpers"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { Track } from "../redux/interfaces"
import { dislikeTrack, likeTrack } from "../redux/thunks"
import { nextTrack, prevTrack } from "../redux/slices/trackSlice"

type PlayerProps = {
  currentTrack?: Track
}

const Player = (props: PlayerProps) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.userSlice.auth)

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
    <div class="boxer justify-center w-[300px]">
      <>
        <div class="flex justify-center">
          <img
            ref={cover}
            class={`w-[200px] h-[200px] bg-white ${
              !props.currentTrack ? "border border-1 border-black" : ""
            }`}
            src="/src/assets/pie-tunes-logo.svg"
          ></img>
        </div>

        <div class={"flex flex-col text-center"}>
          {props.currentTrack ? (
            <span>{props.currentTrack.title}</span>
          ) : (
            <div class="h-2.5 bg-gray-300 w-[100px] mx-auto mb-2.5"></div>
          )}
          {props.currentTrack ? (
            <span>{props.currentTrack.author}</span>
          ) : (
            <div class="h-2.5 bg-gray-300 w-[80px] mx-auto mb-2.5"></div>
          )}
        </div>

        <audio ref={audio} id="audioPlayer" controls>
          Your browser does not support the audio tag.
        </audio>

        <div class="flex justify-between px-[80px]">
          <button onClick={() => dispatch(prevTrack())}>prev</button>

          {auth.authenticated && props.currentTrack && (
            <button
              onClick={() =>
                props.currentTrack.liked
                  ? dispatch(dislikeTrack(props.currentTrack.hash))
                  : dispatch(likeTrack(props.currentTrack.hash))
              }
            >
              {props.currentTrack.liked ? "dislike" : "like"}
            </button>
          )}

          <button onClick={() => dispatch(nextTrack())}>next</button>
        </div>
      </>
    </div>
  )
}

export default Player
