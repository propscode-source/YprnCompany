# Security Best Practices

This document outlines the security measures implemented in this application and recommendations for maintaining security.

## Implemented Security Features

### Backend Security

1. **CORS Protection**
   - Origin validation with whitelist
   - Configurable via `ALLOWED_ORIGINS` environment variable
   - Development: localhost origins allowed by default
   - Production: only whitelisted domains accepted

2. **Rate Limiting**
   - Login endpoint: 5 attempts per 15 minutes per IP
   - File upload endpoints: 50 uploads per 15 minutes per IP
   - Prevents brute force attacks and DoS

3. **Input Validation**
   - Required field validation
   - Length validation for text fields
   - Number validation with min/max constraints
   - Automatic input sanitization (trimming whitespace)

4. **File Upload Security**
   - File type validation (MIME type checking)
   - File size limits (5MB default)
   - Secure file deletion (path traversal prevention)
   - Rate limiting on upload endpoints

5. **Path Traversal Prevention**
   - `safeDeleteFile()` utility validates all file paths
   - Ensures files are within allowed upload directory
   - Blocks attempts to access parent directories

6. **SQL Injection Prevention**
   - All queries use parameterized statements ($1, $2, etc.)
   - No string concatenation for SQL queries

7. **Password Security**
   - bcrypt hashing with 12 salt rounds
   - Admin passwords never stored in plain text
   - Default password configurable via environment variable

8. **JWT Authentication**
   - Secure token generation with configurable expiry
   - Token verification on protected routes
   - JWT_SECRET required at startup

## Known Limitations & Recommendations

### High Priority

1. **JWT Storage**
   - ⚠️ Currently stored in localStorage (vulnerable to XSS)
   - **Recommendation**: Implement HttpOnly cookies for token storage
   - Requires backend to set cookies and frontend to remove localStorage

2. **CSRF Protection**
   - ⚠️ No CSRF tokens implemented
   - **Recommendation**: Add CSRF token middleware for state-changing requests
   - Consider using `csurf` package or similar

3. **Token Invalidation**
   - ⚠️ Tokens cannot be revoked after logout
   - **Recommendation**: Implement token blacklist in Redis or database
   - Alternative: Use short-lived tokens with refresh tokens

4. **File Upload - Magic Bytes Validation**
   - ⚠️ Only MIME type and extension validation
   - **Recommendation**: Add magic number (file signature) validation
   - Prevents MIME type spoofing attacks

### Medium Priority

5. **SSL Certificate Validation**
   - ⚠️ Production uses `rejectUnauthorized: false` for Supabase
   - **Recommendation**: Use proper SSL certificates
   - Only disable for trusted managed services

6. **Security Headers**
   - ✅ Helmet.js enabled in production
   - **Recommendation**: Review and customize headers for specific needs

7. **Session Management**
   - ⚠️ No session tracking
   - **Recommendation**: Track active sessions per user
   - Allow users to view/revoke active sessions

8. **Audit Logging**
   - ⚠️ Limited logging of security events
   - **Recommendation**: Log all authentication attempts, file operations
   - Consider centralized logging solution

### Low Priority

9. **API Documentation**
   - Add OpenAPI/Swagger documentation
   - Document rate limits and security requirements

10. **Dependency Scanning**
    - Regular `npm audit` checks
    - Automated dependency updates

## Environment Variables Security Checklist

- [ ] `JWT_SECRET` is strong and unique (minimum 32 characters)
- [ ] `DATABASE_URL` contains strong password
- [ ] `ALLOWED_ORIGINS` configured for production domain
- [ ] `DEFAULT_ADMIN_PASSWORD` changed from default
- [ ] `.env` file never committed to git (in `.gitignore`)
- [ ] Production environment variables set securely (not in code)

## Deployment Security Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (use crypto.randomBytes)
- [ ] Configure ALLOWED_ORIGINS for production domain
- [ ] Enable HTTPS/TLS on all endpoints
- [ ] Review and enable appropriate Helmet.js options
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy for database
- [ ] Test rate limiting is working
- [ ] Review file upload limits based on expected usage
- [ ] Enable production error logging (not console.error)

### Regular Maintenance

- [ ] Weekly: Review security logs for suspicious activity
- [ ] Monthly: Run `npm audit` and update dependencies
- [ ] Quarterly: Review and rotate JWT_SECRET
- [ ] Quarterly: Security assessment and penetration testing

## Incident Response

If you suspect a security breach:

1. **Immediate Actions**
   - Rotate JWT_SECRET immediately (invalidates all tokens)
   - Review logs for unauthorized access
   - Check for unusual file uploads or database changes
   - Disable affected admin accounts if needed

2. **Investigation**
   - Identify the attack vector
   - Assess data exposure
   - Document timeline and impact

3. **Recovery**
   - Patch vulnerabilities
   - Restore from backup if needed
   - Notify affected users if personal data compromised
   - Update security measures

## Contact

For security issues, please contact the development team immediately.
Do not disclose security vulnerabilities publicly until they are patched.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
