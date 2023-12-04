import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../redux/store"
import { toggleLikedTracks } from "../redux/trackSlice"

const Control = () => {
  const dispatch = useDispatch<AppDispatch>()
  const likedMode = useSelector(
    (state: RootState) => state.tracks.buttons.liked
  )

  return (
    <div class="boxer">
      <h4 class="boxer-title" style={{ minWidth: "100px" }}>
        Controls
      </h4>
      <button>generate playlist</button>
      <button>open playlist</button>
      <button onClick={() => dispatch(toggleLikedTracks())}>
        {likedMode ? "all tracks" : "liked"}
      </button>
    </div>
  )
}

export default Control
