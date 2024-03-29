import { ErrorMessage, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Form, Header } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationErrors from "../errors/ValidationErrors";

function RegisterForm() {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{displayName: '', username: '', email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.register(values).catch(error => {
                    console.log(error);
                    setErrors({error});
                } 
            )}
            validationSchema={Yup.object({
                displayName: Yup.string().required('This field is required'),
                username: Yup.string().required('This field is required'),
                email: Yup.string().required('This field is required').email('Must be a valid email address'),
                password: Yup.string().required('This field is required'),
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as='h2' content='Sign up to Reactivities' color="teal" textAlign="center" />
                    <MyTextInput name="displayName" placeholder="Display Name" />
                    <MyTextInput name="username" placeholder="User name" />
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password" type="password"/>
                    <ErrorMessage 
                        name="error" render={() => <ValidationErrors errors={errors.error} />}
                    />
                    <Button disabled={isSubmitting || !isValid || !dirty} 
                        loading={isSubmitting} positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
}

export default observer(RegisterForm);