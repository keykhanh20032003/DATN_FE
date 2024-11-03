import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import sidebar_items from '../../assets/JsonData/sidebar_routes.json';
import './styles.css';
import Images from '~/assets';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/reducers';

const Sidebar = () => {
  const location = useLocation();
  const themeReducer = useSelector((state: RootState) => state.ThemeReducer);
  const activeItem = sidebar_items.findIndex((item) => item.route === location.pathname);

  const logoImage = themeReducer.mode === 'theme-mode-light' ? Images.logoOnlineShop : Images.logoOnlineShopDark;
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logoImage} alt="company logo" />
      </div>
      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index}>
          <SidebarItem title={item.display_name} icon={item.icon} active={index === activeItem} />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
