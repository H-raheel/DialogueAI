// components/withRoleProtection.js

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const withRoleProtection = (WrappedComponent, allowedRoles) => {
  const WithRoleProtectionWrapper = (props) => {
    const user = useSelector((state) => state.user);
    console.log(user)
    const role = useSelector((state) => state.role);
    const router = useRouter();

    useEffect(() => {
      console.log("in usee eff")
      console.log(user)
      console.log(role)
      if (user === null) {
        router.push('/login'); // Redirect to login if user is not authenticated
      } else if (!allowedRoles.includes(role)) {
        router.push('/unauthorized'); // Redirect to unauthorized if role is not allowed
      }
    }, [user, role, allowedRoles, router.pathname]); // useEffect dependencies

   
    if (user && allowedRoles.includes(role)) {
      return <WrappedComponent {...props} />;
    }

    // Return null or a loader component while redirection is in progress
    return null;
  };

  return WithRoleProtectionWrapper;
};

export default withRoleProtection;
