import React, { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
// Pages
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const location = useLocation();

  return (
    <Fragment>
      <Route exact path='/' component={HomePage} />

      <Route 
        path={'/(.+)'}
        render={() => (
          <Fragment>      
          <NavBar />
          <Container style={{marginTop: '7em'}}>
            <Route exact path='/activities' component={ActivityDashboard} />
            <Route exact path='/activities/:id' component={ActivityDetails} />
            <Route key={location.key} path={['/create-activity', '/manage/:id']} component={ActivityForm} />
            {/* <Route path='*' component={HomePage} /> */}
          </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
