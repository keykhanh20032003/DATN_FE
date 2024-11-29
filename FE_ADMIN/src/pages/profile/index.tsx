import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EditProfile from './editProfileTap';
import ProfileTap from './profileTap';
import ChangePass from './changePassTap';

const Profile = () => {
  const location = useLocation();
  const [choose, setChoose] = useState(0);
  const [tabChanged, setTabChanged] = useState(false);
  const refScroll = useRef(null);
  const WIDTH_WINDOW = window.innerWidth;
  const handleTabClick = (index) => {
    const tabPosition = WIDTH_WINDOW * index;
    refScroll.current?.scrollTo({
      left: tabPosition,
      behavior: 'smooth',
    });
    setChoose(index);
    setTabChanged(true);
  };
  React.useEffect(() => {
    if (location.state && location.state.chooseTab !== undefined) {
      setChoose(location.state.chooseTab);
    }
  }, [location.state]);
  const tabs = [
    {
      id: 1,
      title: 'Hồ sơ',
    },
    {
      id: 2,
      title: 'Thay đổi thông tin',
    },
    {
      id: 3,
      title: 'Đổi mật khẩu',
    },
  ];
  return (
    <div>
      <div className="mt-2 h-10 flex px-4 justify-around items-center cursor-pointer">
        {!!tabs &&
          tabs.map((item, index) => {
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: index === choose ? '#2999ff' : '#fff',
                }}
                className="w-[30%] h-full flex flex-col items-center justify-center "
                onClick={() => {
                  handleTabClick(index);
                }}
              >
                <p
                  className="text-base text-black font-bold"
                  style={{
                    color: index === choose ? '#fff' : 'black',
                  }}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
      </div>
      <div
        ref={refScroll}
        className="no-scrollbar h-full w-full pt-4"
        style={{
          overflowX: 'hidden',
          display: 'flex',
          scrollBehavior: 'smooth',
        }}
      >
        <div
          className=" no-scrollbar h-full "
          style={{
            flex: `0 0 ${WIDTH_WINDOW - 376}px`,
          }}
        >
          <ProfileTap />
        </div>
        <div
          className="no-scrollbar h-full "
          style={{
            flex: `0 0 ${WIDTH_WINDOW + 376}px`,
          }}
        >
          <EditProfile />
        </div>
        <div
          className=" no-scrollbar h-full "
          style={{
            flex: `0 0 ${WIDTH_WINDOW - 376}px`,
          }}
        >
          <ChangePass />
        </div>
      </div>
    </div>
  );
};

export default Profile;
