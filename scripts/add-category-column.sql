-- Add category column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Web App';

-- Update existing projects with appropriate categories
UPDATE projects SET category = 'Landing' 
WHERE LOWER(title) LIKE '%portfolio%' 
   OR LOWER(title) LIKE '%showcase%' 
   OR LOWER(title) LIKE '%video editor%'
   OR LOWER(description) LIKE '%portfolio%' 
   OR LOWER(description) LIKE '%showcase%';

UPDATE projects SET category = 'Web App' 
WHERE LOWER(title) LIKE '%app%' 
   OR LOWER(title) LIKE '%tracker%' 
   OR LOWER(title) LIKE '%quiniela%'
   OR LOWER(title) LIKE '%store%'
   OR LOWER(title) LIKE '%translator%'
   OR LOWER(description) LIKE '%application%' 
   OR LOWER(description) LIKE '%manage%' 
   OR LOWER(description) LIKE '%tracking%'
   OR LOWER(description) LIKE '%catalog%'
   OR LOWER(description) LIKE '%interactive%';

-- Show the results
SELECT id, title, category FROM projects ORDER BY category, title; 