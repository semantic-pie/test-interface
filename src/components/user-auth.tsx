import { useEffect, useState } from "preact/hooks"
import { HTMLProps } from "preact/compat"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { auth, signUp } from "../redux/thunks"
import { logout, tryAuth } from "../redux/slices/userSlice"
import { getGenre } from "../utils/helpers"

const UserAuth = () => {
  const dispatch = useAppDispatch()

  const authData = useAppSelector(state => state.userSlice.auth)

  const [openLogin, setOpenLogin] = useState(false)
  const [openSignUp, setOpenSignIn] = useState(false)

  const closeLogin = () => setOpenLogin(false)
  const closeSigUp = () => setOpenSignIn(false)

  useEffect(() => {
    dispatch(tryAuth())
  }, [dispatch])

  return (
    <div class="boxer">
      {authData.authenticated ? (
        <>
          <Authenticated />
        </>
      ) : (
        <div>
          <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
            {!openSignUp && (
              <Login
                close={closeLogin}
                onClick={() => setOpenLogin(true)}
                isOpen={openLogin}
              />
            )}
            {!openLogin && (
              <SignUp
                close={closeSigUp}
                onClick={() => setOpenSignIn(true)}
                isOpen={openSignUp}
              />
            )}
          </div>
          {!openLogin && !openSignUp && <span>{authData.message}</span>}
          
        </div>
      )}
    </div>
  )
}

const Authenticated = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.userSlice.auth)
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      <div>Hi, {auth.username}</div>
      <button class="flex" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  )
}

const SignUp = (
  props: HTMLProps<HTMLButtonElement> & { isOpen: boolean; close: () => void }
) => {
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const genres = useAppSelector(state => getGenre(state.tracksSlice.tracks.all))
  const [userGenres, setUserGenres] = useState<string[]>([])

  const toggleGenre = (genre: string) => {
    if (userGenres.includes(genre)) {
      setUserGenres(userGenres.filter((g) => g != genre))
    } else {
      setUserGenres([...userGenres, genre])
    }
  }

  console.log("render")
  return (
    <>
      {!props.isOpen ? (
        <button class="flex" onClick={props.onClick}>
          SignUp
        </button>
      ) : (
        <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
          <div>
            <label htmlFor="name">username</label>
            <input
              onChange={(e) => setUsername(e.currentTarget.value)}
              id="name"
              type="text"
            />

            <label htmlFor="password">password</label>
            <input
              onChange={(e) => setPassword(e.currentTarget.value)}
              id="password"
              type="password"
            />

            <button
              onClick={() => {
                dispatch(
                  signUp({
                    username,
                    password,
                    favoriteGenres: [
                      ...userGenres.map((g) => ({ name: g, weight: 5 })),
                    ],
                    userRole: "ROLE_USER",
                  })
                ).then((ignored) => {
                  dispatch(auth({ username, password }))
                  setPassword("")
                  setUsername("")
                  setUserGenres([])
                  props.close()
                })
              }}
            >
              Login
            </button>
          </div>
          <div>
            <div>
              {genres.map((g) => (
                <span
                  class={`${
                    userGenres.includes(g.idtf)
                      ? "genre-selected"
                      : "genre-select"
                  }`}
                  onClick={() => toggleGenre(g.idtf)}
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const Login = (
  props: HTMLProps<HTMLButtonElement> & { isOpen: boolean; close: () => void }
) => {
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <>
      {!props.isOpen ? (
        <button class="flex" onClick={props.onClick}>
          Login
        </button>
      ) : (
        <>
          <label htmlFor="name">username</label>
          <input
            onChange={(e) => setUsername(e.currentTarget.value)}
            id="name"
            type="text"
          />

          <label htmlFor="password">password</label>
          <input
            onChange={(e) => setPassword(e.currentTarget.value)}
            id="password"
            type="password"
          />

          <button
            onClick={() => {
              dispatch(auth({ username, password })), props.close()
            }}
          >
            Login
          </button>
        </>
      )}
    </>
  )
}

export default UserAuth
