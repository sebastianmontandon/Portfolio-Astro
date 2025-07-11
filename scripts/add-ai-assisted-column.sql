-- Add ai_assisted column to projects table
-- This script should be run in the Supabase SQL editor

-- Add the ai_assisted column as a boolean with default value false
ALTER TABLE projects 
ADD COLUMN ai_assisted BOOLEAN DEFAULT false;

-- Update specific projects that were developed with AI assistance
-- Note: Replace these IDs with the actual IDs from your database
UPDATE projects 
SET ai_assisted = true 
WHERE title IN ('TrackingDude', 'Store Site');

-- Add a comment to the column for documentation
COMMENT ON COLUMN projects.ai_assisted IS 'Indicates if the project was developed with AI assistance';

-- Create an index for better query performance (optional)
CREATE INDEX idx_projects_ai_assisted ON projects(ai_assisted);

-- Verify the changes
SELECT id, title, ai_assisted FROM projects ORDER BY created_at DESC; 