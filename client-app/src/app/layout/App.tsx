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
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import Spinner from './Spinner';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation();
  const {userStore, commonStore} = useStore();

  useEffect(() => {
    if(commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if(!commonStore.appLoaded) return <Spinner content='Loading ...' />

  return (
    <Fragment>
      <ToastContainer position='top-right' />
      <ModalContainer />

      <Route exact path='/' component={HomePage} />
      <Route 
        path={'/(.+)'}
        render={() => (
          <Fragment>      
          <NavBar />
          <Container style={{marginTop: '7em'}}>
            <Switch>
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route exact path='/activities/:id' component={ActivityDetails} />
              <Route key={location.key} path={['/create-activity', '/manage/:id']} component={ActivityForm} />
              <Route path='/errors' component={TestErrors} />
              <Route path='/server-error' component={ServerError} />
              <Route path='/login' component={LoginForm} />
              <Route component={NotFound} />
            </Switch>
          </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
