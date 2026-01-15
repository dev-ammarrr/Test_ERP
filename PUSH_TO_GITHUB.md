# Push to GitHub - Commands

Run these commands in the project directory:

```bash
cd "/Users/macbookpro/Desktop/test code/lyra_agents/generated-projects/2222/2222/add-rbac-auethentication-crud"

# Initialize git (if not already)
git init

# Add remote repository
git remote add origin https://github.com/dev-ammarrr/Test_ERP.git
# OR if remote exists, update it:
# git remote set-url origin https://github.com/dev-ammarrr/Test_ERP.git

# Add all files (node_modules will be ignored by .gitignore)
git add .

# Commit
git commit -m "Initial commit: BookMe E-Ticketing Platform with RBAC authentication"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You may need to authenticate with GitHub (username/password or token).
