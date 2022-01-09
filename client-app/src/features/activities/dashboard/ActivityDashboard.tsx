import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity.model";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    editMode: boolean;
    submitting: boolean;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    openForm: (id?: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

function ActivityDashboard ({activities, selectedActivity, deleteActivity, submitting,
        selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit}: Props) {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting} />
            </Grid.Column>
            
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&
                <ActivityDetails 
                    activity={selectedActivity} 
                    cancelSelectActivity={cancelSelectActivity}
                    openForm={openForm} />
                }
                
                {editMode && 
                <ActivityForm 
                    closeForm={closeForm}
                    activity={selectedActivity}
                    createOrEdit={createOrEdit}
                    submitting={submitting} />
                }
            </Grid.Column>
        </Grid>
    );
}

export default ActivityDashboard;