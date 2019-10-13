# Universal App Roadmap
https://github.com/mircea-dinoiu/financial/issues/21

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

# How to deploy:
```
# Install the following:
# - Git
# - NodeJS

git clone -b master git@github.com:mircea-dinoiu/financial.git

pushd financial
yarn build
yarn start
```

# Env variables
- `DEBUG=true` enters debug mode
- `USE_CSRF=true` uses csrf for requests
- `TIMEZONE=+00:00` sets timezone
- `SESSION_STORE=memory` uses memory session instead of DB
- `SESSION_SECRET=keyboardcat` sets the secret key for session 
- `FIXER_API_KEY=keyboardcat` sets the [fixer](https://fixer.io/) key 
