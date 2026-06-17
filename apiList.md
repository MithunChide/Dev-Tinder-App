
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
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRouter
- GET /user/requests/receive
- GET /user/connections
- GET /user/feed --to get all the user available in tinder