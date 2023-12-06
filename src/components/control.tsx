
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { toggleLikedTracks } from "../redux/slices/trackSlice"
import { fetchPlaylist, generateNewFlowPlaylist } from "../redux/thunks"

const Control = () => {
  const dispatch = useAppDispatch()
  const likedMode = useAppSelector(
    state => state.tracks.buttons.liked
  )

  return (
    <div class="boxer">
      <h4 class="boxer-title" style={{ minWidth: "100px" }}>
        Controls
      </h4>
      <button onClick={() => dispatch(generateNewFlowPlaylist())}>generate playlist</button>
      <button onClick={() => dispatch(fetchPlaylist())}>open playlist</button>
      <button onClick={() => dispatch(toggleLikedTracks())}>
        {likedMode ? "all tracks" : "liked"}
      </button>
    </div>
  )
}

export default Control
