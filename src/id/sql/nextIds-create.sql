CREATE TABLE IF NOT EXISTS next_ids (
      name      VARCHAR(40) PRIMARY KEY,
      next_id   INT DEFAULT 1001,
      increment INT DEFAULT 1000,
      mod_time  timestamp DEFAULT current_timestamp
      );
