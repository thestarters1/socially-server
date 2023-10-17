import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT
});

db.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to MySQL DB!');
});


export  const initDb = async () => {
  db.execute(`CREATE DATABASE IF NOT EXISTS social`)

  db.query(`USE social`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(45) NOT NULL,
      email VARCHAR(45) NOT NULL,
      password VARCHAR(200) NOT NULL,
      name VARCHAR(45) NOT NULL,
      coverPic VARCHAR(200),
      profilePic VARCHAR(200),
      city VARCHAR(45),
      website VARCHAR(45)
  )
`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`desc\` VARCHAR(200),
      img VARCHAR(300),
      userId INT NOT NULL,
      createdAt DATETIME,
      FOREIGN KEY (userId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  )
`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      postId INT NOT NULL,
      FOREIGN KEY (userId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (postId) 
          REFERENCES social.posts(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  )
`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      \`desc\` VARCHAR(45),
      createdAt DATETIME,
      userId INT NOT NULL,
      postId INT NOT NULL,
      FOREIGN KEY (userId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (postId) 
          REFERENCES social.posts(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  )
`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.stories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      img VARCHAR(200),
      userId INT NOT NULL,
      FOREIGN KEY (userId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  )
`);

  db.execute(`
  CREATE TABLE IF NOT EXISTS social.relationships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      followerUserId INT NOT NULL,
      followedUserId INT NOT NULL,
      FOREIGN KEY (followerUserId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      FOREIGN KEY (followedUserId) 
          REFERENCES social.users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
  )
`);
}