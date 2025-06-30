
-- Create feedback_links table
CREATE TABLE IF NOT EXISTS feedback_links (
  id VARCHAR(255) PRIMARY KEY,
  customer_number VARCHAR(255) NOT NULL,
  concern VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  feedback_url TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT FALSE
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(255) PRIMARY KEY,
  rating INTEGER NOT NULL,
  comment TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer VARCHAR(255),
  customer_name VARCHAR(255),
  concern VARCHAR(255),
  ref_id VARCHAR(255) REFERENCES feedback_links(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_links_customer ON feedback_links(customer_number);
CREATE INDEX IF NOT EXISTS idx_feedback_links_created_at ON feedback_links(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_ref_id ON feedback(ref_id);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
