
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

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id VARCHAR(255) PRIMARY KEY,
  domains JSONB NOT NULL,
  concern_texts JSONB NOT NULL,
  concern_types JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin credentials if not exists
INSERT INTO admin_credentials (username, password, updated_at) 
VALUES ('admin', 'admin123', CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_links_customer ON feedback_links(customer_number);
CREATE INDEX IF NOT EXISTS idx_feedback_links_created_at ON feedback_links(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_ref_id ON feedback(ref_id);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_settings_created_at ON admin_settings(created_at);
