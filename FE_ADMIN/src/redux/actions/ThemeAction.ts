import Types from "../types"

interface Action {
  type: string;
  payload?: any;
}

const setMode = (mode: string): Action => {
  return {
      type: Types.SET_MODE,
      payload: mode
  };
};

const setColor = (color: string): Action => {
  return {
      type: Types.SET_COLOR,
      payload: color
  };
};

const getTheme = (): Action => {
  return {
      type: Types.GET_THEME
  };
};

const ThemeAction = {
  setColor,
  setMode,
  getTheme
};

export default ThemeAction;
