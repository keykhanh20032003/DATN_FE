import React from 'react';

interface SidebarItemProps {
  active?: boolean;
  icon: string;
  title: string;
}
const SidebarItem = (props: SidebarItemProps) => {
  const active = props.active ? 'active' : '';

  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

export default SidebarItem;
