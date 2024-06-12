-- @block
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_gamepublisher BOOLEAN NOT NULL DEFAULT 0

)

-- @block
CREATE TABLE Games (
    id INT AUTO_INCREMENT,
    game_name VARCHAR(255) NOT NULL,
    game_description VARCHAR(255),
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
)

-- @block
CREATE TABLE UserGames (
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (game_id) REFERENCES Games(id)
)

-- @block
SELECT * FROM Users


-- @block
INSERT INTO Users(username, password, is_gamepublisher) VALUES ('Sultan', '123', 1)

-- @block
INSERT INTO Games(game_name, game_description, user_id) VALUES ('MSDchess', 'Мырзаш Сұлтанның Шахмат ойыны', 9)
