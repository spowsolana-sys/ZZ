# Auth Testing Playbook — ZEV SHOP

Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist on users.email (unique), login_attempts.identifier, password_reset_tokens.expires_at (TTL).

Step 2: API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@zevshop.com","password":"ZevAdmin2025!"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login should return the user object and set `access_token` + `refresh_token` cookies. The `/me` call should return the same user using those cookies.

Step 3: Flow tests
- Register: POST /api/auth/register {"name","email","password"} → user + cookies
- Wishlist: POST /api/wishlist {"product_id":"noir","action":"add"} → list; GET /api/wishlist
- Reviews: POST /api/reviews {"product_id":"noir","rating":5,"text":"..."}; GET /api/reviews?product_id=noir
- Questions: POST /api/questions {"product_id":"noir","question":"...","email":"..."}; GET /api/questions?product_id=noir
- Newsletter: POST /api/newsletter {"email":"..."}
- Contact: POST /api/contact {"name","email","message"}
- Tracking: GET /api/orders/ZV-TEST?email=x@y.z → {"found": false}
- Rewards: GET /api/account/rewards (auth) → {"spent":0,"threshold":1000,"coupon":100}
