import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import Dropdown from '../dropdown';
import ThemeMenu from '../thememenu';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import authApi from '~/api/auth.apis';
import { REQUEST_API } from '~/constants/method';
import Types from '~/redux/types';
import Api from '~/api/apis';
import { Notification } from '~/types/notification.type';
import path from '~/constants/path';

interface UserMenu {
  icon: string;
  content: string;
  route: string;
}

const renderNotificationItem = (
  item: Notification,
  index: number,
  onClick: React.MouseEventHandler<HTMLDivElement>,
) => (
  <div className="notification-item cursor-pointer" key={index} onClick={onClick}>
    <span className={`font-bold text-base ${item.type === 1 ? 'text-blue' : 'text-red-500'}`}>{item.content}</span>
  </div>
);

const renderUserToggle = (user: { username: string }) =>
  user && (
    <div className="topnav__right-user cursor-pointer flex items-center">
      <div className="topnav__right-user__name">{user.username}</div>
    </div>
  );

const renderUserMenu = (item: UserMenu, index: number, onClick: React.MouseEventHandler<HTMLDivElement>) => (
  <div key={index}>
    <div className="notification-item cursor-pointer" onClick={onClick}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </div>
);
const TopNav = () => {
  const curr_user = useSelector((state: RootState) => state.ReducerAuth.user);
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notifications2, setNotifications2] = React.useState<Notification[]>([]);
  const user_menu = [
    {
      icon: 'bx bx-user',
      content: 'Hồ sơ',
      route: '/profile',
    },
    // {
    //   icon: 'bx bx-cog',
    //   content: 'Cài đặt',
    //   route: '/setting',
    // },
    {
      icon: 'bx bx-log-out-circle bx-rotate-180',
      content: 'Đăng xuất',
      route: '/logout',
    },
  ];
  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.status) {
      navigate('/login');
      localStorage.setItem('user', null);
      localStorage.setItem('token', '');
      dispatch({ type: Types.LOGOUT });
    } else {
      toast.error('Lỗi', {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  const routeClickHandle: { [key: string]: () => void } = {
    '/profile': () => {
      navigate('/profile');
    },
    '/setting': () => {
      navigate('/setting');
    },
    '/logout': () => {
      handleLogout();
    },
  };
  const handleCickUser = (itemRoute: string) => {
    const clickHanle = routeClickHandle[itemRoute];
    if (clickHanle) {
      clickHanle();
    }
  };
  const getNotification = async () => {
    if (!!token) {
      try {
        const url = Api.getNotification();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setNotifications(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const pushNotification = async () => {
    if (!!token) {
      try {
        const url = Api.pushNotification();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          const notification = res.data;
          setNotifications2(notification);
          notification.map((item) =>
            item.type === 1
              ? toast.success(`${item.content}`, {
                  position: 'top-right',
                  pauseOnHover: false,
                  theme: 'dark',
                })
              : toast.error(`${item.content}`, {
                  position: 'top-right',
                  pauseOnHover: false,
                  theme: 'dark',
                }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    getNotification();
  }, [notifications2.length]);

  React.useEffect(() => {
    pushNotification();
  }, [notifications2.length]);

  const readNotification = async (item: Notification) => {
    if (!!token) {
      try {
        const url = Api.readNotification(item.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          getNotification();
          if (item.type === 1 || item.type === 2) {
            navigate(path.detailOrder, { state: item.orders });
          }
          if (item.type === 3) {
            navigate(path.detailProduct, { state: item.product });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="topnav">
      <div className="topnav__search"></div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index, () => handleCickUser(item.route))}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge={notifications.length > 0 ? `${notifications.length}` : '0'}
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index, () => readNotification(item))}
            // renderFooter={() => <Link to="/">View All</Link>}
          />
          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
