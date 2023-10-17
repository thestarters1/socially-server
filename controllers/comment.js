import { db } from '../connect.js';
import  jwt  from 'jsonwebtoken';
import moment from 'moment';

export const getComments = (req, res) => {
    console.log(req.query);
    const q = 'SELECT c.*,u.id AS userId ,u.name AS userName ,u.profilePic AS userProfilePic FROM comments AS c JOIN users AS u where c.postId = ? AND u.id = c.userId ORDER BY c.id DESC';
    db.query(q,[req.query.postId] ,(err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        } else {
            res.status(200).json(data);
        }
    })
}

export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Session Expired' });

        const q = 'INSERT INTO comments (`desc`,`createdAt`,`userId`,`postId`) VALUES (?,?,?,?)';
        const values = [
            req.body.desc, 
            moment(Date().now).format('YYYY-MM-DD HH:mm:ss'), 
            userInfo.id,
            req.body.postId
        ];

        db.query(q,values,(err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
            } else {
                res.status(200).json({ message: 'Commet has been created' });
            }
        })
    });
}