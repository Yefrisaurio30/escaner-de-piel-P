import { createContext, useContext, useReducer, useCallback } from 'react'

const initialState = {
  step: 1,
  quiz: { skin: null, veins: null, coverage: null },
  photo: null, // { src, width, height, source }
  points: {
    cheek: { x: 0.62, y: 0.64, color: null },
    forehead: { x: 0.5, y: 0.3, color: null },
    active: 'cheek',
  },
  result: null,
  menuOpen: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step, menuOpen: false }
    case 'SET_QUIZ':
      return { ...state, quiz: { ...state.quiz, [action.key]: action.value } }
    case 'RESET_QUIZ':
      return { ...state, quiz: { skin: null, veins: null, coverage: null } }
    case 'SET_PHOTO':
      return {
        ...state,
        photo: action.photo,
        points: {
          cheek: { x: 0.62, y: 0.64, color: null },
          forehead: { x: 0.5, y: 0.3, color: null },
          active: 'cheek',
        },
        result: null,
      }
    case 'CLEAR_PHOTO':
      return { ...state, photo: null, result: null }
    case 'SET_POINT':
      return {
        ...state,
        points: {
          ...state.points,
          [action.which]: { ...state.points[action.which], ...action.value },
        },
      }
    case 'SET_ACTIVE_POINT':
      return { ...state, points: { ...state.points, active: action.which } }
    case 'SET_POINT_COLOR':
      return {
        ...state,
        points: {
          ...state.points,
          [action.which]: { ...state.points[action.which], color: action.color },
        },
      }
    case 'SET_RESULT':
      return { ...state, result: action.result }
    case 'TOGGLE_MENU':
      return { ...state, menuOpen: !state.menuOpen }
    case 'CLOSE_MENU':
      return { ...state, menuOpen: false }
    case 'RESET_ALL':
      return { ...initialState }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const goTo = useCallback((step) => dispatch({ type: 'SET_STEP', step }), [])
  const next = useCallback(() => dispatch({ type: 'SET_STEP', step: Math.min(6, state.step + 1) }), [state.step])
  const back = useCallback(() => dispatch({ type: 'SET_STEP', step: Math.max(1, state.step - 1) }), [state.step])

  const value = { state, dispatch, goTo, next, back }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}