import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ProfileUpdate } from "../../app/models/profileUpdate.model";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import { Button } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";

interface Props {
    setEditMode: (editMode: boolean) => void;
}
function ProfileEditForm({setEditMode}: Props) {
    const {profileStore: {profile, updateProfile}} = useStore();

    const initialValues = {displayName: profile?.displayName, bio: profile?.bio} as ProfileUpdate;
    const validationSchema = Yup.object({
        displayName: Yup.string().required('This field is required'),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
                updateProfile(values).then(() => {
                    setEditMode(false);
                })
            }}
        >
            {({isSubmitting, isValid, dirty}) => (
                <Form className="ui form">
                    <MyTextInput placeholder="Display Name" name="displayName"/>
                    <MyTextArea  placeholder="Add your Bio" name="bio" rows={3}/>
                    <Button 
                        positive
                        type="submit"
                        loading={isSubmitting}
                        content="Update Profile"
                        floated="right"
                        disabled={!isValid || !dirty}
                    />
                </Form>
            )}
        </Formik>
    );
}

export default observer(ProfileEditForm);