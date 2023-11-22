import { useState } from "preact/hooks"

const UserAuth = () => {
	const [user, setUser] = useState(undefined)
	return (
		<div class="boxer">
				{!user ?
					<div style={{display: 'flex', gap: '5px'}}>
						<label htmlFor="name">username</label>
						<input id='name' type="text" />

						<label htmlFor="password">password</label>
						<input id='password' type="password" />

						<button onClick={() => setUser({username: 'glebchanskiy'})}>Login</button>
					</div>
					:
					<div style={{display: 'flex', gap: '5px'}}>
						<span>Hi, {user.username}</span>
						<button onClick={() => setUser(undefined)}>Logout</button>
					</div>
				}
		</div>
	)
}

export default UserAuth