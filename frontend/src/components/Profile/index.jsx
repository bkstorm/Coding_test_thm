import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { to } from 'await-to-js';
import { toast } from 'react-toastify';

import axios from '../../tools/api';
import './Profile.css';
import { AuthContext } from '../auth/context';

function Profile({ user }) {
  const auth = useContext(AuthContext);

  const handleSubmitting = useCallback(async (values, setSubmitting) => {
    const [error] = await to(axios.put(`${process.env.REACT_APP_API_URL}/users/${user.id}`, values));
    setSubmitting(false);
    if (error) {
      return toast(error.toString(), {
        type: 'error',
      });
    }
    return toast('Successfully!', {
      type: 'success',
    });
  }, []);

  const handleLogout = useCallback(() => {
    auth.logout();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between">
        <h1 className="profile__header">Your profile</h1>
        <button className="btn" type="button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={{
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              country: user.country || '',
              city: user.city || '',
              email: user.email,
              phoneNumber: user.phoneNumber || '',
              emailAlerts: user.emailAlerts || false,
              smsAlerts: user.smsAlerts || false,
            }}
            validationSchema={Yup.object({
              firstName: Yup.string(),
              lastName: Yup.string(),
              country: Yup.string(),
              city: Yup.string(),
              email: Yup.string().email().required('Required'),
              phoneNumber: Yup.string(),
            })}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmitting(values, setSubmitting);
            }}
          >
            <Form noValidate className="row g-3">
              <div className="col-12 col-md-6">
                <Field name="firstName" placeholder="First name" type="text" className="form-control" />
              </div>
              <div className="col-12 col-md-6">
                <Field name="lastName" placeholder="Last name" type="text" className="form-control" />
              </div>
              <div className="col-12 col-md-6">
                <Field name="country" placeholder="Country" type="text" className="form-control" />
              </div>
              <div className="col-12 col-md-6">
                <Field name="city" placeholder="City" type="text" className="form-control" />
              </div>
              <div className="col-12 col-md-6">
                <Field name="email" placeholder="Email" type="text" className="form-control" disabled />
              </div>
              <div className="col-12 col-md-6">
                <Field name="phoneNumber" placeholder="Phone number" type="text" className="form-control" />
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="emailAlerts">
                  <Field type="checkbox" name="emailAlerts" />
                  {' '}
                  Email Alerts
                </label>
              </div>
              <div className="col-12 col-md-6">
                <label htmlFor="smsAlerts">
                  <Field type="checkbox" name="smsAlerts" />
                  {' '}
                  SMS Alerts
                </label>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
};
Profile.defaultProps = {
  user: { email: 'undefined@' },
};

export default Profile;
