import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrum = ({ title }) => {
  return (
    <div className="header-banner">
      <div className="breadcrumb-shop">
        <div className="container">
          <div className="breadcrumb-list  ">
            <ol className="breadcrumb breadcrumb-arrows" itemType="http://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemType="http://schema.org/ListItem">
                <Link to="/" target="_self" itemProp="item">
                  <span itemProp="name">Trang chủ</span>
                </Link>
                <meta itemProp="position" />
              </li>
              <li className="active" itemProp="itemListElement" itemType="http://schema.org/ListItem">
                <span itemProp="item">
                  <strong itemProp="name">{title}</strong>
                </span>
                <meta itemProp="position" />
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrum;
