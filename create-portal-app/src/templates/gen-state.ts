export function genReduxStore(): string {
  return `import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
`
}

export function genAuthSlice(): string {
  return `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  user: Record<string, unknown> | null
  authenticated: boolean
}

const initialState: AuthState = { token: null, user: null, authenticated: false }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: Record<string, unknown> }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.authenticated = true
    },
    logout(state) {
      state.token = null
      state.user = null
      state.authenticated = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
`
}
