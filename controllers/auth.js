import { db } from '../connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {

  //CHECK IF USER EXISTS
  const q = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(q, [req.body.username,req.body.email], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    if (data.length > 0) return res.status(409).json({ message: 'user already exists' });

    //CREATE A NEW USER
    //HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    //INSERT INTO DB
    const q = 'INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?,?,?,?)';
    const values = [req.body.username, req.body.email, hash, req.body.name];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json({ message: 'Server Error' });
      return res.status(200).json({ message: 'user created' });
    });
  })
}
export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(q, [req.body.usernameOrEmail, req.body.usernameOrEmail], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server Error' });
    if (data.length === 0) return res.status(404).json({ message: 'user not found' });

    const user = data[0];
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'invalid email or password' });

    const { password, ...others } = user;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie('accessToken', token, { httpOnly: true }).status(200).json(others);
  });
}
export const logout = (req, res) => {
  res.clearCookie('accessToken',{
    secure:true,
    sameSite:'none'
  }).status(200).json({message:'user has been logged out'});
}
