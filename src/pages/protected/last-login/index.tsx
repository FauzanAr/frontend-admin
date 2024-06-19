import { useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import styles from './lastLogin.module.css';
import { getUser } from '../../../api/user/getUser';
import Response from '../../../api/response';
import { Spinner } from 'react-bootstrap';
import { localStorageKey } from '../../constanta';

function LastLoginCard() {
  const object = localStorage.getItem(localStorageKey.USER_DATA) ? JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || '') : {};
  const [user, setUser] = useState(object);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (_.isEmpty(user)) {
      getUser({token: localStorage.getItem(localStorageKey.JWT) || ''})
        .then((res: Response) => {
          if (res.success) {
            localStorage.setItem(localStorageKey.USER_DATA, JSON.stringify(res.data))
            setUser(res.data);
            setIsLoading(false);
          }
        })
    }

    setIsLoading(false);
  })
  return (
    <div className={styles.lastLoginCard}>
      {isLoading ? (
        <Spinner animation="border" size="sm"/>
      ) : (
        <p>Last Login Time: {moment(user?.lastLoginAt).format('DD MMM, YYYY hh:mm:ss') || ''}</p>
      )}
    </div>
  )
}

export default LastLoginCard