import { db } from '../connect.js';
import jwt from 'jsonwebtoken';

export const getRelationships = (req, res) => {
    const q = 'SELECT followerUserId from relationships WHERE followedUserId = ?';
    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json({ message: 'Server Error' });
        // console.log(data);
        return res.status(200).json(data.map((relationship) => relationship.followerUserId));
    })
}

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });
    //console.log(`followed %o`,req.body);

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Session Expired' });

        const q = 'INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?,?)';
        const values = [ userInfo.id,req.body.followedUserId];

        db.query(q, values, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
            } else {
                res.status(200).json({ message: 'Following User' });
            }
        })
    });
}
export const deleteRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not logged in' });
    //console.log(`unfollowed %o`,req.query);

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json({ message: 'Session Expired' });

        const q = 'DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?';
        const values = [userInfo.id,req.query.followedUserId];
        

        db.query(q, values, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Server Error' });
            } else {
                res.status(200).json({ message: 'Unfollowing User' });
            }
        })
    });
}