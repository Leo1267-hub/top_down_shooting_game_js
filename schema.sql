DROP TABLE IF EXISTS user;

CREATE TABLE user
( 
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS leaderboard;
CREATE TABLE leaderboard
( 
    user_id TEXT PRIMARY KEY,
    score INTEGER NOT NULL DEFAULT 0,
    cheats TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);