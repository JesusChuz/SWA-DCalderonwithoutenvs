import React, { useEffect } from 'react';
import { topNavHeight } from 'src/components/GeneralComponents/CommonStyles';
import { NotificationContainer } from 'src/components/GeneralComponents/Notifications/NotificationContainer';
import { UserNotification } from 'src/components/GeneralComponents/UserNotification';
import { bannerMessageClassName } from 'src/shared/Constants';

export const BannerContainer = () => {
  const bannerContainerRef = React.useRef();

  const applyMainContainerHeight = () => {
    const banners = document.querySelectorAll(`.${bannerMessageClassName}`);
    let totalHeight = 0;
    for (let i = 0; i < banners.length; i++) {
      totalHeight += banners[i].clientHeight;
    }
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
      mainContainer.style['height'] = `calc(100% - ${
        topNavHeight + totalHeight
      }px)`;
    }
  };

  useEffect(() => {
    if (bannerContainerRef.current) {
      const targetNode = document.getElementById('allBannersContainer');
      const config = { attributes: true, childList: true, subtree: true };
      const observer = new MutationObserver(applyMainContainerHeight);
      observer.observe(targetNode, config);
      return () => observer.disconnect();
    } else {
      applyMainContainerHeight();
    }
  }, [bannerContainerRef]);

  useEffect(() => {
    applyMainContainerHeight();
  }, [bannerContainerRef]);

  return (
    <div ref={bannerContainerRef} id='allBannersContainer'>
      <UserNotification />
      <NotificationContainer />
    </div>
  );
};
