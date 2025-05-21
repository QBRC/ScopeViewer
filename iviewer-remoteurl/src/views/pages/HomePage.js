import React from 'react';

import LandingMain from '../LandingMain';
import UploadJson from '../../components/UploadJson';
import LandingBanner from '../LandingBanner';

function HomePage() {
    return (
        <>
          <LandingBanner />
          <LandingMain >
            <UploadJson />
          </LandingMain>
        </>
    );
}
export default HomePage;