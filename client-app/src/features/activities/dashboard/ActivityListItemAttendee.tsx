import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { useStore } from "../../../app/stores/store";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[];
}

function ActivityListItemAttendee({attendees}: Props) {
    const {userStore} = useStore();

    const styles = {
        borderColor: 'orange',
        borderWidth: 4
    };

    return (
        <List horizontal>
            {attendees && attendees.map(attendee => (
                <Popup hoverable key={attendee.username} 
                    trigger={
                        <List.Item as={Link} to={`/profiles/${attendee.username}`}>
                            <Image 
                                size="mini" 
                                circular 
                                src={attendee.image || '/assets/user.png'} 
                                bordered
                                style={attendee.username !== userStore.user?.username && attendee.following ? styles : null}
                            />
                        </List.Item>
                    }>
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    );
}

export default observer(ActivityListItemAttendee);