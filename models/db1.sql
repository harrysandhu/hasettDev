CREATE TABLE IF NOT EXISTS _auth(
    auth_id VARCHAR (100) NOT NULL UNIQUE,
    id VARCHAR (100) NOT NULL UNIQUE,
    password_hash VARCHAR (511) NOT NULL,
    salt VARCHAR (40) NOT NULL,
    PRIMARY KEY(auth_id),
    CONSTRAINT userfk FOREIGN KEY(id) REFERENCES _user(id)
);

CREATE TABLE IF NOT EXISTS _user(
    id VARCHAR (100) NOT NULL UNIQUE,
    first_name VARCHAR (100),
    last_name VARCHAR (100),
    email_address VARCHAR (255) NOT NULL UNIQUE,
    username VARCHAR (255) NOT NULL UNIQUE,
    phone_number VARCHAR (10) NOT NULL UNIQUE,
    phone_number_ext VARCHAR (2) NOT NULL,
    profile_picture_url VARCHAR(1024),
    is_business BOOLEAN D
);


CREATE TABLE IF NOT EXISTS _user_session(
    sess_id VARCHAR(100) NOT NULL UNIQUE,
    id VARCHAR(100) NOT NULL, 
    ip_address VARCHAR (255) NOT NULL,
    session_start timestamptz NOT NULL,
    session_end timestamptz,
    PRIMARY KEY(sess_id),
    CONSTRAINT userfk FOREIGN KEY(id) REFERENCES _user(id)
);