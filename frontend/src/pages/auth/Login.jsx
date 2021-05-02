import React, { useContext } from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../../components/auth/context';

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const { from } = location.state || { from: { pathname: '/' } };

  if (auth.user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          auth
            .login(values.email, values.password)
            .then(() => {
              history.replace(from);
            })
            .catch(() => {
              setSubmitting(false);
            });
        }}
      >
        <Form noValidate>
          <div>
            <label htmlFor="email" className="form-label">
              Email
              {' '}
              <Field name="email" type="text" className="form-control" />
            </label>
            <ErrorMessage name="email">
              {(message) => <div className="d-block invalid-feedback">{message}</div>}
            </ErrorMessage>
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Password
              {' '}
              <Field name="password" type="text" className="form-control" />
            </label>
            <ErrorMessage name="password">
              {(message) => <div className="d-block invalid-feedback">{message}</div>}
            </ErrorMessage>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
