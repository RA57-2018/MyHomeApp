import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './common/Layout';
import {
  AdminMessages,
  AllAdvertisements,
  AllUsers,
  BuyPoints,
  ChosenAdvertisements,
  HomePage,
  Login,
  Messages,
  MyAdvertisements,
  MyData,
  PublishAdvertisement,
  RealEstateProfile,
  Registration,
  UserProfile
} from '@/pages';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';

export const App = () => {
  const { currentUser } = useContext(UserContext);

  let routes = null;
  if (currentUser) {
    routes = (
      <Layout>
        <Routes>
          {currentUser?.roleId === 1 && (
            <Route>
              <Route path='/adminMessages' element={<AdminMessages />} />
              <Route path='/allAdvertisements' element={<AllAdvertisements />} />
              <Route path='/allUsers' element={<AllUsers />} />
              <Route path='/homePage' element={<HomePage />} />
              <Route path='/realEstateProfile/:id' element={<RealEstateProfile />} />
              <Route path='/userProfile' element={<UserProfile />}/>
            </Route>
          )}
          {currentUser?.roleId === 2 && (
            <Route>
              <Route path='/homePage' element={<HomePage />} />
              <Route path='/realEstateProfile/:id' element={<RealEstateProfile />} />
              <Route path='/userProfile' element={<UserProfile />}/>
              <Route path='/myData' element={<MyData />}/>
              <Route path='/chosenAdvertisements' element={<ChosenAdvertisements />}/>
              <Route path='/messages' element={<Messages />}/>
              <Route path='/publishAdvertisement' element={<PublishAdvertisement />}/>
              <Route path='/buyPoints' element={<BuyPoints />}/>
              <Route path='/myAdvertisements' element={<MyAdvertisements />}/>
            </Route>
          )}
          <Route path='*' element={<Navigate to='/homePage' replace />} />
        </Routes>
      </Layout>
    );
  } else {
    routes = (
      <Layout>
        <Routes>
          <Route>
            <Route path='/homePage' element={<HomePage />} />
            <Route path='/realEstateProfile/:id' element={<RealEstateProfile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
          </Route>
        </Routes>
      </Layout>
    );
  }

  return <BrowserRouter>{routes}</BrowserRouter>;
};
