import { observer } from "mobx-react-lite";
import React from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

function ServerError() {
    const {commonStore} = useStore();

    return (
        <Container>
            <Header as='h1' content='Server Error' />
            <Header sub as='h5' content={commonStore.error?.message} />
            {commonStore.error?.details && (
                <Segment>
                    <Header as='h4' content='Stack trace (Development)' color="teal" />
                    <code style={{marginTop: '10px'}}>
                        {commonStore.error?.details}
                    </code>
                </Segment>
            )}
        </Container>
    )
}

export default observer(ServerError);