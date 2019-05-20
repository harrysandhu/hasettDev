USE hasettDev;

CREATE TABLE auth(
    auth_id VARCHAR (100) NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    email_address VARCHAR (255) NOT NULL UNIQUE,
    username VARCHAR (255) NOT NULL UNIQUE,
    password_hash VARCHAR (511) NOT NULL,
    salt VARCHAR (40) NOT NULL,
    PRIMARY KEY(auth_id)
);



CREATE TABLE user_session(
    user_session_id VARCHAR (100) NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    ip_address VARCHAR (255) NOT NULL,
    session_start_datetime DATETIME NOT NULL,
    session_end_datetime DATETIME,
    session_active INT(2) DEFAULT 1,
    PRIMARY KEY(user_session_id)
);



CREATE TABLE business_type(
    business_type_id INT (11) NOT NULL UNIQUE,
    business_name VARCHAR (100) NOT NULL,
    PRIMARY KEY(business_type_id)
);


CREATE TABLE activity_type(
    activity_type_id INT (11) NOT NULL UNIQUE,
    activity_name VARCHAR (100) NOT NULL,
    activity_desc VARCHAR (200) NOT NULL,
    PRIMARY KEY(activity_type_id)
)




CREATE TABLE users(
    u_id VARCHAR (100) NOT NULL UNIQUE,
    first_name VARCHAR (100),
    last_name VARCHAR (100),
    email_address VARCHAR (255) NOT NULL UNIQUE,
    username VARCHAR (255) NOT NULL UNIQUE,
    profile_picture VARCHAR (255),
    header_picture VARCHAR (255),
    signup_datetime DATETIME (255),
    connections INT (11) DEFAULT 0,
    active_connections INT (11) DEFAULT 0,
    business_account INT (2) DEFAULT 1,
    account_verified INT (2) DEFAULT 1,
    PRIMARY KEY (u_id)
); 


-- notifications are basically a result of 
-- a set of user_activities, 
-- on "value" change in notifications where u_id is current_user, 
-- generate notification



CREATE TABLE user_activities(
    user_activity_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,    
    activity_type_id INT (11) NOT NULL,
    PRIMARY KEY (user_activity_id)
);

-- CREATE TABLE notifications(
    
-- );



CREATE TABLE connections(
    connection_count_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    connection_id VARCHAR (100) NOT NULL,
    PRIMARY KEY(connection_count_id)
);


CREATE TABLE business_users(
    business_id VARCHAR (100) NOT NULL UNIQUE,
    u_id VARCHAR (100) NOT NULL,
    business_type_id INT (11) NOT NULL,
    business_name VARCHAR (100) NOT NULL,
    business_email VARCHAR (255) NOT NULL,
    business_phone VARCHAR (20) NOT NULL,
    PRIMARY KEY(business_id)
);

CREATE TABLE business_keywords(
    keyword_id INT (11) AUTO INCREMENT
    business_id VARCHAR (100) NOT NULL,
    keyword VARCHAR (100) NOT NULL,
    PRIMARY KEY(business_id)
);
