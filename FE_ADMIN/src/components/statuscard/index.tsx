import React from 'react';
import './style.css';

interface StatusCardProps {
  icon: string;
  count: string;
  title: string;
}

const StatusCard = (props: StatusCardProps) => {
  return (
    <div className="status-card h-[135px]">
      <div className="status-card__icon">
        <i className={props.icon}></i>
      </div>
      <div className="status-card__info">
        <p>{props.count}</p>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

export default StatusCard;
