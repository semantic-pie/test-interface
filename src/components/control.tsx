import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { toggleLikedTracks, togglePlaylist } from "../redux/slices/trackSlice"
import { fetchPlaylist, generateNewFlowPlaylist } from "../redux/thunks"

const Control = () => {
  const dispatch = useAppDispatch()
  const likedMode = useAppSelector(
    (state) => state.tracksSlice.control.likedList
  )

  return (
    <div class="boxer">
      <h4 class="boxer-title" style={{ minWidth: "100px" }}>
        Controls
      </h4>
      <button onClick={() => dispatch(generateNewFlowPlaylist()).then(ignored=>dispatch(fetchPlaylist()))}>
        generate playlist
      </button>
      <button onClick={() => dispatch(togglePlaylist())}>open playlist</button>
      <button onClick={() => dispatch(toggleLikedTracks())}>
        {likedMode ? "all tracks" : "liked"}
      </button>
    </div>
  )
}

export default Control
