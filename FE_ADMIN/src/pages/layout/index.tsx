import React from 'react';
import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '~/components/sidebar';
import TopNav from '~/components/topnav';
import path from '~/constants/path';
import ThemeAction from '~/redux/actions/ThemeAction';
import { RootState } from '~/redux/reducers';

import Product from '../products';
import Category from '../category';
import SuspenseContent from './suspenseContent';

import './styles.css';

const Layout = () => {
  const themeReducer = useSelector((state: RootState) => state.ThemeReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const themeClass = localStorage.getItem('themeMode') || 'theme-mode-light';
    const colorClass = localStorage.getItem('colorMode') || 'theme-mode-light';

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  const ScrollToTopOnNavigate = () => {
    const { pathname } = useLocation();

    React.useEffect(() => {
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      };

      document.body.classList.add('scroll-fade-out');
      scrollToTop();

      setTimeout(() => {
        document.body.classList.remove('scroll-fade-out');
      }, 300);
    }, [pathname]);

    return null;
  };

  return (
    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
      <ScrollToTopOnNavigate />
      <div className="layout__sidebar">
        <Sidebar />
      </div>
      <div className="layout__content">
        <div className="layout__content-main">
          <Suspense fallback={<SuspenseContent />}>
            <Routes>
              <Route path={path.products} element={<Product />} />
              <Route path={path.categories} element={<Category />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default Layout;
