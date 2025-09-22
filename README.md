# MobiPay.Utils

SETUP:
- backend: npm run dev
- frontend: npm run dev
- mongodb: create a clean database and replace connection string in .env

STACK USED:
- MERN (MongoDB, Express, React, Node)

LIBRARIES worth mentioning:
- Used MUI for the react front-end
- speakeasy for QR code setup

ISSUES:
- I wanted to create a free AWS account to use KMS for enabling encryption at rest in the database. Unfortunately, AWS needed a few days to validate my card details.
- Because of the AWS issue I also couldn't test the "Forgot Password" feature properly, as I wanted to use SES for this. I did implement the code regardless (I think it should work)
- Docker - I added the files but ran into errors when either running or building the image. After debugging for some time I decided to give up for the time being and will likely look into it again later on.

WHAT WAS RESEARCHED & WHERE WAS CHATPGPT USED?
- I used ChatGpt to double check security related requirements such as rate limiting and other middleware related tasks
- I've never worked with MongoDB or Express/Node, so there was research done in this area

