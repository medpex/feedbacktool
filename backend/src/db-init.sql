CREATE TABLE IF NOT EXISTS feedback_links (
  id VARCHAR(64) PRIMARY KEY,
  customer_number VARCHAR(64) NOT NULL,
  concern VARCHAR(128) NOT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  feedback_url TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  used BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(64) PRIMARY KEY,
  rating INTEGER NOT NULL,
  comment TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  customer VARCHAR(64),
  customer_name VARCHAR(128),
  concern VARCHAR(128),
  ref_id VARCHAR(64),
  CONSTRAINT fk_feedback_link FOREIGN KEY(ref_id) REFERENCES feedback_links(id) ON DELETE SET NULL
); 