# Test Scripts

Individual test scripts for each feature. Run them in order:

## Prerequisites

1. Run database migration:
```bash
npm run migrate
```

2. Make sure backend is running on port 5001 (or set `TEST_BASE_URL` env var)

## Test Scripts (Run in Order)

1. **test-01-health.js** - Health check
   ```bash
   node scripts/test-01-health.js
   ```

2. **test-02-organization.js** - Create organization "Wyven inc"
   ```bash
   node scripts/test-02-organization.js
   ```

3. **test-03-user.js** - Create user "Joshua J Smith"
   ```bash
   node scripts/test-03-user.js
   ```

4. **test-04-login.js** - Test login for admin and user
   ```bash
   node scripts/test-04-login.js
   ```

5. **test-05-category.js** - Create category
   ```bash
   node scripts/test-05-category.js
   ```

6. **test-06-department.js** - Create department
   ```bash
   node scripts/test-06-department.js
   ```

7. **test-07-asset.js** - Create asset
   ```bash
   node scripts/test-07-asset.js
   ```

8. **test-08-get-assets.js** - Get all assets
   ```bash
   node scripts/test-08-get-assets.js
   ```

9. **test-09-get-users.js** - Get all users (admin only)
   ```bash
   node scripts/test-09-get-users.js
   ```

## Run All Tests

```bash
npm test
```

Or with custom base URL:
```bash
TEST_BASE_URL=http://localhost:5001 npm test
```

## Test Data

- **Organization**: Wyven inc (info@wyveninc.com, password: 2001)
- **Admin**: admin@wyveninc.com / password: 2001
- **User**: joshua@wyveninc.com / password: 2001 (Joshua J Smith)
- **Category**: Electronics
- **Department**: IT Department
- **Asset**: MacBook Pro ($2499.99)

