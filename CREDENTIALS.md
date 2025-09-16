# 🔐 King Covy Golf Club - Access Credentials

## 🌐 Site Access Password
**Password**: `KingCovy2025!`

This password protects the entire website from public access while you're developing.

## 👨‍💼 Admin Dashboard Credentials
**Username**: `admin`  
**Password**: `KingCovyAdmin2025!`

These credentials provide access to the admin dashboard and all administrative functions.

## 🔒 Security Features

### Site Lock
- Protects the entire website with a password
- Session-based (expires when browser closes)
- Animated login screen with futuristic design
- Prevents public access during development

### Admin Authentication
- Separate login system for admin dashboard
- Session-based authentication
- Secure access to all admin functions
- Logout functionality

## 🚀 How to Use

### Accessing the Website
1. Visit your website URL
2. Enter the site access password: `KingCovy2025!`
3. You'll have access for the current browser session

### Accessing Admin Dashboard
1. Navigate to `/admin`
2. Enter username: `admin`
3. Enter password: `KingCovyAdmin2025!`
4. Access all admin functions

## ⚠️ Important Security Notes

1. **Change These Passwords**: These are default passwords - change them before going live!
2. **Site Lock**: Remove the site lock component before public launch
3. **Admin Security**: Consider implementing more robust authentication for production
4. **Session Storage**: Passwords are stored in browser session storage (temporary)

## 🛠️ Customization

### Changing Site Access Password
Edit `src/components/auth/SiteLock.tsx`:
```typescript
const SITE_PASSWORD = 'YourNewPassword!';
```

### Changing Admin Credentials
Edit `src/components/auth/AdminLogin.tsx`:
```typescript
const ADMIN_USERNAME = 'yourusername';
const ADMIN_PASSWORD = 'YourNewPassword!';
```

### Removing Site Lock
Remove `<SiteLock />` from `src/components/layout/ClientLayout.tsx`

---
*Keep these credentials secure and change them before going live!*

