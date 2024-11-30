import React from 'react';
import Images from '~/assets';

const LeftPage = () => {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="text-3xl text-center font-bold ">
            <img src={Images.logoLight} className="w-60 inline-block mr-2 mask mask-circle" />
          </h1>
          <div className="text-center mt-12"></div>
          {/* Importing pointers component */}
        </div>
      </div>
    </div>
  );
};

export default LeftPage;
