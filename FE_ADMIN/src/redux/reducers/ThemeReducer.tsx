import Types from '../types'

interface ThemeState {
  mode?: string
  color?: string
}

interface Action {
  type: string
  payload?: any
}

const ThemeReducer = (state: ThemeState = {}, action: Action): ThemeState => {
  switch (action.type) {
    case Types.SET_MODE:
      return {
        ...state,
        mode: action.payload
      }
    case Types.SET_COLOR:
      return {
        ...state,
        color: action.payload
      }
    default:
      return state
  }
}

export default ThemeReducer
