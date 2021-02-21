# Mission
This application is made to track down your monthly expenses and incomes in the family and help you understand better where your money are going and how can you be more careful what you're spending money on.

It provides organizational tools like:
- Categories for expenses
- Money location for expenses/incomes (eg. John's Pocket / John's Credit Card / Maria's House Deposit)
- Split expenses on multiple persons
- Repeat expenses/incomes on every day/week/month/year so you won't have to rewrite your financial plan every month

# Tech stack
Working with:
- Backend with NodeJS & Express & Sequelize
- Responsive UI with React & MaterialUI

# Run Financial on macOS
1. `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`
2. `brew install nvm`
3. `brew install yarn`
4. Create `.env` file per example:
```
DEBUG=true
PORT=3001
TIMEZONE=+00:00
DATABASE_URL=string
USE_CSRF=false
SESSION_SECRET=string
```

# Deploy:
First time prerequisites:
```
brew install awsebcli
eb init
```

```
git checkout master
git pull origin master
yarn
yarn build
eb deploy
```

# Env variables
- `DEBUG=true` enters debug mode
- `USE_CSRF=true` uses csrf for requests
- `TIMEZONE=+00:00` sets timezone
- `SESSION_STORE=memory` uses memory session instead of DB
- `SESSION_SECRET=keyboardcat` sets the secret key for session 

# Docker
```
docker build -t financial .
docker run -d -p 8080:8080 -p 3000:3000 financial 
```
