const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "pi",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(
      `
  SELECT * 
  FROM users
  WHERE email LIKE $1
  `,
      [email]
    )
    .then((result) => {
      console.log(result.rows[0]);
      if (result) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `
  SELECT * 
  FROM users
  WHERE id LIKE $1
  `,
      [id]
    )
    .then((result) => {
       console.log(result.rows[0]);
      if (result) {
        return result.rows[0];
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  
  console.log(user);
  return pool
  .query(
    `
INSERT INTO users VALUES
(DEFAULT, $1, $2, $3)
`,
    [user.name, user.email, user.password]
  )
  .then((result) => {
    // console.log(result.rows);
    if (result) {
      return result.rows;
    }
    return null;
  })
  .catch((err) => {
    console.log(err.message);
  });
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  console.log('this ran');
  
  return pool
  .query(
    `
SELECT * 
FROM reservations
WHERE guest_id = $1
LIMIT $2
`,
  [guest_id, limit]
  )
  .then((result) => {
    if (result) {
      // console.log(`getAllReservations for ${guest_id} with a limit of ${limit}`);
      // console.log( result.rows[0] );
      return result.rows[0];
    }
    console.log("getAllReservations returned no results");
    return null;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
exports.getAllReservations = getAllReservations;

// return getAllProperties(null, 2);
/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  return pool
    .query(`SELECT * FROM properties LIMIT $1`, [limit])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
