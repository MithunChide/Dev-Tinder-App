
# DevTinder Api List

## authRouter
- POST /signup
- POST /login
- POST /logout

## profile/Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

## userRouter
- GET /user/connections
- GET /user/request
- GET /user/feed --to get all the user available in tinder