const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:Masuk123@172.16.254.15:5432/qren_notif';
const db = pgp(connectionString);

function updateOne(query) {
  return query;
//   db.none('update notif set name=$1, surname=$2, dob=$3 where id=$4',
//     [req.query.name, req.query.surname, req.query.dob, parseInt(req.params.id)])
//     .then(function () {
//       res.status(200)
//         .json({
//           status: 'success',
//           message: 'Updated player'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
}

module.exports = {
  updateOne
};