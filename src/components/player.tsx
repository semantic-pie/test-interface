import { useEffect, useRef } from "preact/hooks"

import { DOWNLOAD_TRACK_URL } from "../config"
import { setCover } from "../utils/helpers"
import { useAppDispatch, useAppSelector, useKeyDown } from "../redux/hooks"
import { Track } from "../redux/interfaces"
import { dislikeTrack, likeTrack } from "../redux/thunks"
import { nextTrack, prevTrack } from "../redux/slices/trackSlice"
import { NextIcon, PieTunesIcon, PrevIcon } from "./icons"
import { Ref } from "preact"

type PlayerProps = {
  currentTrack?: Track
}

const Player = (props: PlayerProps) => {
  const audio = useRef<HTMLAudioElement>(null)
  const cover = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (props.currentTrack) {
      const url = DOWNLOAD_TRACK_URL + "/" + props.currentTrack.hash
      audio.current.crossOrigin = "anonymous"
      audio.current.src = url
      setCover(url, cover)
    }
  }, [props.currentTrack])

  useKeyDown(() => {
    if (audio.current.paused) audio.current.play()
    else audio.current.pause()
  }, [" "])

  return (
    <div class="boxer flex-col md:justify-center md:h-auto md:w-[350px]">
      <>
        <div class="flex justify-center">
          {props.currentTrack ? (
            <img
              ref={cover}
              class="w-full sm:w-[200px] sm:h-[200px] bg-white"
            ></img>
          ) : (
            <PieTunesIcon />
          )}
        </div>

        <div class={"hidden md:flex flex-col text-center"}>
          {props.currentTrack ? (
            <a
              class="scs-scn-element scs-scn-highlighted"
              {...{ ["sc_addr"]: props.currentTrack.scAddr }}
            >
              {props.currentTrack.title}
            </a>
          ) : (
            <div class="h-2.5 bg-gray-300 w-[100px] mx-auto mb-2.5 animate-pulse"></div>
          )}
          {props.currentTrack ? (
            <span>{props.currentTrack.author}</span>
          ) : (
            <div class="h-2.5 bg-gray-300 w-[80px] mx-auto mb-2.5 animate-pulse"></div>
          )}
        </div>

        <audio
          ref={audio}
          class="hidden md:flex mx-auto"
          id="audioPlayer"
          controls
        >
          Your browser does not support the audio tag.
        </audio>

        <DesktopPlayerControl currentTrack={props.currentTrack}/>
        <MobilePlayerControl audio={audio} currentTrack={props.currentTrack} />
      </>
    </div>
  )
}

const MobilePlayerControl = (props: {
  currentTrack?: Track
  audio: Ref<HTMLAudioElement>
}) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.userSlice.auth)
  return (
    <div class=" !p-1 fixed !left-0 !right-0 !bottom-0 md:hidden ">
      <div class="boxer !p-0 z-50 w-100% flex flex-col bg-white">
        {props.currentTrack && (
          <div class={"md:hidden flex flex-col text-center"}>
            {props.currentTrack ? (
              <a
                class="scs-scn-element scs-scn-highlighted"
                {...{ ["sc_addr"]: props.currentTrack.scAddr }}
              >
                {props.currentTrack.title}
              </a>
            ) : (
              <div class="h-2.5 bg-gray-300 w-[100px] mx-auto mb-2.5 animate-pulse"></div>
            )}
            {props.currentTrack ? (
              <span>{props.currentTrack.author}</span>
            ) : (
              <div class="h-2.5 bg-gray-300 w-[80px] mx-auto mb-2.5 animate-pulse"></div>
            )}
          </div>
        )}
                  {auth.authenticated && props.currentTrack && (
            <button
              class='flex mx-auto'
              onClick={() =>
                props.currentTrack.liked
                  ? dispatch(dislikeTrack(props.currentTrack.hash))
                  : dispatch(likeTrack(props.currentTrack.hash))
              }
            >
              {props.currentTrack.liked ? "dislike" : "like"}
            </button>
          )}

        <div class="h-[55px] flex w-full justify-between items-center">
          <PrevIcon class="h-[55px]" onClick={() => dispatch(prevTrack())} />

          <audio ref={props.audio} class="" id="audioPlayer" controls>
            Your browser does not support the audio tag.
          </audio>

          <NextIcon class="h-[55px]" onClick={() => dispatch(nextTrack())} />
        </div>
      </div>
    </div>
  )
}

const DesktopPlayerControl = (props: { currentTrack?: Track }) => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.userSlice.auth)
  return (
    <div class="hidden md:flex justify-between px-[80px] ">
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
  )
}

export default Player
