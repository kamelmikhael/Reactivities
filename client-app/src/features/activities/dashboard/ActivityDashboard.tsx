import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Spinner from "../../../app/layout/Spinner";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

function ActivityDashboard () {
    
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry]);

    if(activityStore.loadingInitial) return <Spinner content='Loading App' />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard);