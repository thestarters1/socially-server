import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getLikes = (req, res) => {
    const q = 'SELECT userId from likes WHERE postId = ?';
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        return res.status(200).json(data.map((like) => like.userId));
    })
}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });
    console.log('addLike');

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Session Expired' });

        const q = 'INSERT INTO likes (`userId`,`postId`) VALUES (?,?)';
        const values = [ userInfo.id,req.body.postId];

        db.query(q, values, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
            } else {
                res.status(200).json({ message: 'Post has been liked' });
            }
        })
    });
}
export const deleteLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });
    console.log('deleteLike');

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Session Expired' });

        const q = 'DELETE FROM likes WHERE `userId` = ? AND `postId` = ?';
        const values = [userInfo.id,req.query.postId];
        console.log(req.query);

        db.query(q, values, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
            } else {
                res.status(200).json({ message: 'Post has been disliked.' });
            }
        })
    });
}