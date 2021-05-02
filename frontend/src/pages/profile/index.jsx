import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../components/auth/context';
import Profile from '../../components/Profile';

function ProfilePage() {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/users/${auth.user.id}`).then((response) => {
      setUser(response.data);
    });
  }, []);

  return (
    <div className="container">
      {!user ? 'Loading...' : <Profile user={user} />}
    </div>
  );
}

export default ProfilePage;
