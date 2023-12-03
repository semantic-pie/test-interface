import { useEffect, useState } from "preact/hooks"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../redux/store"
import { auth, tryAuth } from "../redux/userSlice"
import { useSelector } from "react-redux"

const UserAuth = () => {
	
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const dispatch = useDispatch<AppDispatch>()

	const authData = useSelector((state: RootState) => state.user.auth)
	
	useEffect(() => {
		dispatch(tryAuth())
	}, [])
	
	return (
		<div class="boxer">
				{!authData.authenticated ?
				<>
					<div style={{display: 'flex', gap: '5px'}}>
						<label htmlFor="name">username</label>
						<input onChange={(e) => setUsername(e.currentTarget.value)} id='name' type="text" />

						<label htmlFor="password">password</label>
						<input onChange={(e) => setPassword(e.currentTarget.value)} id='password' type="password" />

						<button onClick={() => dispatch(auth({username, password}))}>Login</button>
					</div>
					{authData.message && <span>{authData.message}</span>}
					</>
					:
					<div style={{display: 'flex', gap: '5px'}}>
						<span>Hi, {authData.username}</span>
						{/* <button onClick={() => setUser(undefined)}>Logout</button> */}
					</div>
				}
		</div>
	)
}

export default UserAuth