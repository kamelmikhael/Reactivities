import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Spinner from "../../app/layout/Spinner";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

function ProfilePage() {
    const {profileStore} = useStore();
    const {loadProfile, loadingProfile, profile, setActiveTab} = profileStore;

    const {username} = useParams<{username: string}>();

    useEffect(() => {
        loadProfile(username);

        // cleaning
        return () => {
            setActiveTab(0);
        };
    }, [loadProfile, username, setActiveTab]);

    if(loadingProfile) return <Spinner content="Loading profile..." />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile && 
                <>                    
                    <ProfileHeader profile={profile}/>
                    <ProfileContent profile={profile}/>
                </>}
            </Grid.Column>
        </Grid>
    );
}

export default observer(ProfilePage);