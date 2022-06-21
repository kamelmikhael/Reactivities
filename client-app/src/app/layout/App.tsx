import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
// Pages
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import Spinner from './Spinner';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {
  const location = useLocation();
  const {userStore, commonStore} = useStore();

  useEffect(() => {
    if(commonStore.token) {
      userStore.getCurrentLoggedInUser().finally(() => commonStore.setAppLoaded(true));
    } else {
      commonStore.setAppLoaded(true);
    }
  }, [commonStore, userStore]);

  if(!commonStore.appLoaded) return <Spinner />

  return (
    <Fragment>
      <ToastContainer position='top-right' />
      
      <ModalContainer />

      <Route exact path='/' component={HomePage} />
      <Route 
        path={'/(.+)'}
        render={() => (
          <>      
            <NavBar />
            <Container style={{marginTop: '7em'}}>
              <Switch>
                <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                <PrivateRoute exact path='/activities/:id' component={ActivityDetails} />
                <PrivateRoute key={location.key} path={['/create-activity', '/manage/:id']} component={ActivityForm} />
                <PrivateRoute path='/profiles/:username' component={ProfilePage} />
                <PrivateRoute path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
