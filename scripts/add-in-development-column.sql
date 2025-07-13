-- Add in_development column to projects table
-- This script should be run in the Supabase SQL editor

-- Add the in_development column as a boolean with default value false
ALTER TABLE projects 
ADD COLUMN in_development BOOLEAN DEFAULT false;

-- Update specific projects that are currently in development
-- Note: Replace these IDs with the actual IDs from your database
UPDATE projects 
SET in_development = true 
WHERE title IN ('Repo Share', 'Webhook Debugger');

-- Add a comment to the column for documentation
COMMENT ON COLUMN projects.in_development IS 'Indicates if the project is currently under development';

-- Create an index for better query performance (optional)
CREATE INDEX idx_projects_in_development ON projects(in_development);

-- Verify the changes
SELECT id, title, ai_assisted, in_development FROM projects ORDER BY created_at DESC; 