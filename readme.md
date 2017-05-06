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
- Desktop UI with Sencha ExtJS 6
- Mobile UI with React & MaterialUI

# How to deploy:
```
# Install the following:
# - Git
# NodeJS
# Sencha Cmd (https://www.sencha.com/products/extjs/cmd-download/)

git clone -b master git@github.com:mircea-dinoiu/financial.git

pushd financial
bash scripts/build.sh
npm start
```