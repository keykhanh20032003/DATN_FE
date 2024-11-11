import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from '~/components/footer';
import Header from '~/components/header';
import Topbar from '~/components/topbar';
import path from '~/constants/path';
import './styles.css';
import Home from '../home';
import ProductView from '../product';
import DetailProduct from '../detailProduct';



const Layout = () => {
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
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollToTopBtn = document.getElementById('scrollToTop');
      if (scrollToTopBtn) {
        if (window.scrollY > 300) {
          scrollToTopBtn.classList.add('show');
        } else {
          scrollToTopBtn.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <ScrollToTopOnNavigate />
      <Topbar />
      <Header />
      <div className="mainWrapper--content">
        <Routes>
          <Route path={path.home} element={<Home />} />
          <Route path={path.product} element={<ProductView />} />
          <Route path={path.product} element={<DetailProduct />} />

        </Routes>
      </div>
      <Footer />
      <div className="back-to-top" id="scrollToTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <a className="cursor-pointer">
          <div className="btt-back">
            <span className="btt-label-back">Về đầu trang</span>
            <span className="btt-icon-back">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className="bi bi-arrow-bar-up"
                viewBox="0 0 16 16"
              >
                {' '}
                <path
                  fillRule="evenodd"
                  d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"
                />{' '}
              </svg>
            </span>
          </div>
        </a>
      </div>
    </>
  );
};

export default Layout;
