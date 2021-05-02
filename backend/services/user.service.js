const shajs = require('sha.js');
const jwt = require('jsonwebtoken');
const db = require('../sql/db');

const SECRET = process.env.SECRET || 'test-dev-secret';

/**
 * Generate token
 * @param {number} id
 * @returns
 */
const genToken = (id) => jwt.sign({
  id,
}, process.env.JWT_SECRET, {
  subject: `${id}`,
});
/**
 * Generate hash password
 * Generate online: https://emn178.github.io/online-tools/sha256.html
 * @param {string} email
 * @param {string} password
 */
const hashPassword = (email, password) => shajs('sha256').update(`${email}${password}${SECRET}`).digest('hex');

const authenticateUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name as firstName, s.last_name as lastName
              FROM users s
              WHERE email = $1 AND password = $2`,
    values: [email, hash],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const user = rows[0];
      return {
        user,
        token: genToken(user.id),
      };
    }
    throw (new Error('Bad credentials'));
  } catch (error) {
    throw (new Error('Bad credentials'));
  }
};

const getUser = async (id) => {
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name as "firstName", s.last_name as "lastName",
              s.country, s.city, s.phone_number as "phoneNumber",
              s.sms_alerts as "smsAlerts", s.email_alerts as "emailAlerts"
              FROM users s
              WHERE id = $1`,
    values: [id],
  };
  try {
    const { rows } = await db.query(queryText);
    if (rows[0]) {
      const user = rows[0];
      return user;
    }
    throw (new Error('User not found'));
  } catch (error) {
    throw (new Error('Bad credentials'));
  }
};

const updateUser = async (id, user) => {
  const queryText = {
    text: ` UPDATE users
            SET first_name = $1, last_name = $2, country = $3,
            city = $4, phone_number = $5,
            email_alerts = $6, sms_alerts = $7
            WHERE id = $8`,
    values: [user.firstName, user.lastName, user.country, user.city, user.phoneNumber,
      user.emailAlerts, user.smsAlerts, id],
  };
  try {
    const { rowCount } = await db.query(queryText);
    if (rowCount) {
      return {
        ...user,
        id,
      };
    }
    throw (new Error('User not found'));
  } catch (error) {
    throw (new Error('Internal server error'));
  }
};

module.exports = {
  authenticateUser,
  getUser,
  updateUser,
};
