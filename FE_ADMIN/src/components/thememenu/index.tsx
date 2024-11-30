import React from 'react';
import { useDispatch } from 'react-redux';
import ThemeAction from '~/redux/actions/ThemeAction';
import './styles.css';

interface ModeSetting {
  id: string;
  name: string;
  background: string;
  class: string;
}

interface ColorSetting {
  id: string;
  name: string;
  background: string;
  class: string;
}

const mode_settings: ModeSetting[] = [
  {
    id: 'light',
    name: 'Light',
    background: 'light-background',
    class: 'theme-mode-light',
  },
  {
    id: 'dark',
    name: 'Dark',
    background: 'dark-background',
    class: 'theme-mode-dark',
  },
];

const color_settings: ColorSetting[] = [
  {
    id: 'blue',
    name: 'Blue',
    background: 'blue-color',
    class: 'theme-color-blue',
  },
  {
    id: 'red',
    name: 'Red',
    background: 'red-color',
    class: 'theme-color-red',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    background: 'cyan-color',
    class: 'theme-color-cyan',
  },
  {
    id: 'green',
    name: 'Green',
    background: 'green-color',
    class: 'theme-color-green',
  },
  {
    id: 'orange',
    name: 'Orange',
    background: 'orange-color',
    class: 'theme-color-orange',
  },
];

const clickOutsideRef = (
  content_ref: React.RefObject<HTMLDivElement>,
  toggle_ref: React.RefObject<HTMLButtonElement>,
) => {
  document.addEventListener('mousedown', (e) => {
    // user click toggle
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
      if (content_ref.current) {
        content_ref.current.classList.toggle('active');
      }
    } else {
      // user click outside toggle and content
      if (content_ref.current && !content_ref.current.contains(e.target)) {
        content_ref.current.classList.remove('active');
      }
    }
  });
};

const ThemeMenu = () => {
  const menu_ref = React.useRef<HTMLDivElement>(null);
  const menu_toggle_ref = React.useRef<HTMLButtonElement>(null);

  clickOutsideRef(menu_ref, menu_toggle_ref);

  const setActiveMenu = () => {
    if (menu_ref.current) {
      menu_ref.current.classList.add('active');
    }
  };

  const closeMenu = () => {
    if (menu_ref.current) {
      menu_ref.current.classList.remove('active');
    }
  };

  const [currMode, setCurrMode] = React.useState('light');
  const [currColor, setCurrColor] = React.useState('blue');

  const dispatch = useDispatch();

  const setMode = (mode: ModeSetting) => {
    setCurrMode(mode.id);
    localStorage.setItem('themeMode', mode.class);
    dispatch(ThemeAction.setMode(mode.class));
  };

  const setColor = (color: ColorSetting) => {
    setCurrColor(color.id);
    localStorage.setItem('colorMode', color.class);
    dispatch(ThemeAction.setColor(color.class));
  };

  React.useEffect(() => {
    const themeClass = mode_settings.find((e) => e.class === localStorage.getItem('themeMode')) || mode_settings[0];

    const colorClass = color_settings.find((e) => e.class === localStorage.getItem('colorMode')) || color_settings[0];

    setCurrMode(themeClass.id);
    setCurrColor(colorClass.id);
  }, []);
  return (
    <div>
      <button ref={menu_toggle_ref} className="dropdown__toggle" onClick={() => setActiveMenu()}>
        <i className="bx bx-palette"></i>
      </button>
      <div ref={menu_ref} className="theme-menu">
        <h4>Cài đặt giao diện</h4>
        <button className="theme-menu__close" onClick={() => closeMenu()}>
          <i className="bx bx-x"></i>
        </button>
        <div className="theme-menu__select">
          <span>Chọn kiểu</span>
          <ul className="mode-list">
            {mode_settings.map((item, index) => (
              <li key={index} onClick={() => setMode(item)}>
                <div className={`mode-list__color ${item.background} ${item.id === currMode ? 'active' : ''}`}>
                  <i className="bx bx-check"></i>
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="theme-menu__select">
          <span>Choose color</span>
          <ul className="mode-list">
            {color_settings.map((item, index) => (
              <li key={index} onClick={() => setColor(item)}>
                <div className={`mode-list__color ${item.background} ${item.id === currColor ? 'active' : ''}`}>
                  <i className="bx bx-check"></i>
                </div>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeMenu;
