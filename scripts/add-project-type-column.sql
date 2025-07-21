-- Add project_type column to projects table
-- This script should be run in the Supabase SQL editor

-- Add the project_type column as an enum with default value 'personal'
ALTER TABLE projects 
ADD COLUMN project_type TEXT DEFAULT 'personal' CHECK (project_type IN ('personal', 'paid'));

-- Update specific projects with appropriate project types
-- Personal projects
UPDATE projects 
SET project_type = 'personal' 
WHERE title IN ('TrackingDude', 'Quiniela APP', 'CSV to JSON', 'Hands Translator');

-- Paid projects
UPDATE projects 
SET project_type = 'paid' 
WHERE title IN ('Store Site', 'Profesional Video Editor Portfolio');

-- Add a comment to the column for documentation
COMMENT ON COLUMN projects.project_type IS 'Indicates if the project is personal or paid work';

-- Create an index for better query performance (optional)
CREATE INDEX idx_projects_project_type ON projects(project_type);

-- Verify the changes
SELECT id, title, project_type, ai_assisted, in_development FROM projects ORDER BY created_at DESC; 