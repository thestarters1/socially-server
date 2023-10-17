import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const user = data[0];
    const { password, ...others } = user;
    res.status(200).json(others);
  });
}
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  console.log('updateUser');

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json({ message: 'Session Expired' });

    let q = 'UPDATE users SET';
    let values = [];

    if (req.body.name) {
      q += ' `name` = ?,';
      values.push(req.body.name);
    }

    if (req.body.city) {
      q += ' `city` = ?,';
      values.push(req.body.city);
    }

    if (req.body.website) {
      q += ' `website` = ?,';
      values.push(req.body.website);
    }

    if (req.body.profilePic) {
      q += ' `profilePic` = ?,';
      values.push(req.body.profilePic);
    }

    if (req.body.coverPic) {
      q += ' `coverPic` = ?,';
      values.push(req.body.coverPic);
    }

    // Remove the trailing comma from the query string
    q = q.slice(0, -1);

    // Add the WHERE clause to the query and push the ID to the values array
    q += ' WHERE `id` = ?';
    values.push(userInfo.id);

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json({ message: 'Server Error' });
      if (data.affectedRows === 0) return res.status(400).json({ message: 'You can update only your profile' });
      return res.status(200).json({ message: 'Profile has been updated' });
    })
  });

}