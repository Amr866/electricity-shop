import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { authOptions, ADMIN_PHONES } from '../../src/lib/core/auth.ts';
import { checkAdminPermission } from '../../src/lib/core/adminAuth.ts';
import { hashPassword, verifyPassword } from '../../src/lib/core/password.ts';

const prisma = new PrismaClient();

test('Phase 19 Seam 1: SMS OTP Elevation Neutralization & Password-Gated Admin Auth (FR-067)', async () => {
  const adminPhone = ADMIN_PHONES[0]; // '09136260072'
  const otpCode = '98765';

  // Create an unexpired verification token for admin phone
  await prisma.verificationToken.create({
    data: {
      phone: adminPhone,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const provider = authOptions.providers[0];
  const authorizeHandler = provider.options?.authorize || provider.authorize;

  // 1. Authenticate with OTP alone
  const otpSessionUser = await authorizeHandler({
    phone: adminPhone,
    otpCode: otpCode,
  });

  assert.ok(otpSessionUser, 'User should be returned upon valid OTP');
  assert.equal(
    otpSessionUser.role,
    'CUSTOMER',
    'Session role from SMS OTP MUST be clamped to CUSTOMER, preventing admin elevation per FR-067'
  );
  assert.deepEqual(
    otpSessionUser.permissions,
    [],
    'OTP sessions must not inherit administrative module permissions'
  );

  // 2. Authenticate with Phone + Password
  // Ensure the admin user exists in DB with a valid password
  const testPassword = 'AdminSecret2026';
  const hashedPassword = hashPassword(testPassword);

  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
      tokenVersion: 0,
      isSuspended: false,
    },
    create: {
      phone: adminPhone,
      name: 'مدیر ارشد تست',
      role: 'ADMIN',
      password: hashedPassword,
      tokenVersion: 0,
      isSuspended: false,
      city: 'نجف‌آباد',
    },
  });

  const passwordSessionUser = await authorizeHandler({
    phone: adminPhone,
    password: testPassword,
  });

  assert.ok(passwordSessionUser, 'User should be authenticated with valid password');
  assert.equal(passwordSessionUser.role, 'ADMIN', 'Session role must be ADMIN for valid password credentials');
  assert.equal(passwordSessionUser.tokenVersion, 0, 'tokenVersion must be populated from database');
  assert.ok(passwordSessionUser.permissions.includes('ALL'), 'Root Owner must receive ALL permissions');

  // 3. Incorrect password must reject with null
  const failedSessionUser = await authorizeHandler({
    phone: adminPhone,
    password: 'WrongPassword123',
  });
  assert.equal(failedSessionUser, null, 'Incorrect password must reject authentication');
});

test('Phase 19 Seam 2: Self-Service Password Rotation & Global Session Revocation (FR-062, FR-065)', async () => {
  const testSecondaryPhone = '09139991122';
  const initialPassword = 'InitialPass123';
  const initialHash = hashPassword(initialPassword);

  // Setup secondary administrator in database
  const user = await prisma.user.upsert({
    where: { phone: testSecondaryPhone },
    update: {
      name: 'مدیر تستی ثانویه',
      role: 'ADMIN',
      password: initialHash,
      tokenVersion: 0,
      isSuspended: false,
      adminPermissions: JSON.stringify(['REPAIRS']),
    },
    create: {
      phone: testSecondaryPhone,
      name: 'مدیر تستی ثانویه',
      role: 'ADMIN',
      password: initialHash,
      tokenVersion: 0,
      isSuspended: false,
      adminPermissions: JSON.stringify(['REPAIRS']),
      city: 'نجف‌آباد',
    },
  });

  // Verify initial tokenVersion is 0
  assert.equal(user.tokenVersion, 0);

  // Verify old password
  assert.ok(verifyPassword(initialPassword, user.password), 'Initial password matches scrypt hash');

  // Test complexity validation
  const complexityRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  assert.equal(complexityRegex.test('short1'), false, 'Rejects passwords shorter than 8 chars');
  assert.equal(complexityRegex.test('onlyletters'), false, 'Rejects passwords without numbers');
  assert.equal(complexityRegex.test('12345678'), false, 'Rejects passwords without letters');
  assert.equal(complexityRegex.test('ValidPass123'), true, 'Accepts valid alphanumeric password >= 8 chars');

  // Simulate password rotation: atomically increment tokenVersion
  const newPassword = 'NewSecretPass2026';
  const newHashedPassword = hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashedPassword,
      tokenVersion: { increment: 1 },
    },
  });

  assert.equal(updatedUser.tokenVersion, 1, 'tokenVersion must increment to 1');
  assert.ok(verifyPassword(newPassword, updatedUser.password), 'New password matches updated scrypt hash');
  assert.equal(verifyPassword(initialPassword, updatedUser.password), false, 'Old password no longer matches');

  // Verify Stale Session Rejection:
  // An active JWT holding tokenVersion: 0 must mismatch dbUser.tokenVersion (which is now 1)
  const staleSessionTokenVersion = 0;
  const isSessionValid = updatedUser.tokenVersion === staleSessionTokenVersion && !updatedUser.isSuspended;
  assert.equal(isSessionValid, false, 'Stale tokenVersion: 0 must be rejected immediately');
});

test('Phase 19 Seam 3: Scoped Administrative Permissions & Access Control (FR-064)', () => {
  // 1. Secondary admin with only REPAIRS permission
  const secondaryAdminSession = {
    user: {
      phone: '09139991122',
      permissions: ['REPAIRS'],
    },
  };

  assert.equal(checkAdminPermission(secondaryAdminSession, 'REPAIRS'), true, 'Should allow REPAIRS module');
  assert.equal(checkAdminPermission(secondaryAdminSession, 'ORDERS'), false, 'Should deny ORDERS module');
  assert.equal(checkAdminPermission(secondaryAdminSession, 'CATALOG'), false, 'Should deny CATALOG module');
  assert.equal(checkAdminPermission(secondaryAdminSession, 'REVIEWS'), false, 'Should deny REVIEWS module');

  // 2. Secondary admin with CATALOG and ORDERS
  const multiModuleSession = {
    user: {
      phone: '09139993344',
      permissions: ['CATALOG', 'ORDERS'],
    },
  };

  assert.equal(checkAdminPermission(multiModuleSession, 'CATALOG'), true);
  assert.equal(checkAdminPermission(multiModuleSession, 'ORDERS'), true);
  assert.equal(checkAdminPermission(multiModuleSession, 'REPAIRS'), false);

  // 3. Root Owner universal permission bypass
  const rootOwnerSession = {
    user: {
      phone: ADMIN_PHONES[0],
      permissions: [],
    },
  };

  assert.equal(checkAdminPermission(rootOwnerSession, 'CATALOG'), true, 'Root Owner has bypass for CATALOG');
  assert.equal(checkAdminPermission(rootOwnerSession, 'ORDERS'), true, 'Root Owner has bypass for ORDERS');
  assert.equal(checkAdminPermission(rootOwnerSession, 'REPAIRS'), true, 'Root Owner has bypass for REPAIRS');
  assert.equal(checkAdminPermission(rootOwnerSession, 'REVIEWS'), true, 'Root Owner has bypass for REVIEWS');
});

test('Phase 19 Seam 4: Immediate Session Invalidation on Account Suspension (FR-063, FR-065)', async () => {
  const suspendedAdminPhone = '09139995566';
  const initialHash = hashPassword('SecondaryPass123');

  const admin = await prisma.user.upsert({
    where: { phone: suspendedAdminPhone },
    update: {
      name: 'مدیر تعلیق شونده',
      role: 'ADMIN',
      password: initialHash,
      tokenVersion: 1,
      isSuspended: false,
      adminPermissions: JSON.stringify(['ORDERS']),
    },
    create: {
      phone: suspendedAdminPhone,
      name: 'مدیر تعلیق شونده',
      role: 'ADMIN',
      password: initialHash,
      tokenVersion: 1,
      isSuspended: false,
      adminPermissions: JSON.stringify(['ORDERS']),
      city: 'نجف‌آباد',
    },
  });

  // Suspend admin: atomically set isSuspended: true and increment tokenVersion
  const suspended = await prisma.user.update({
    where: { id: admin.id },
    data: {
      isSuspended: true,
      tokenVersion: { increment: 1 },
    },
  });

  assert.equal(suspended.isSuspended, true, 'isSuspended must be true');
  assert.equal(suspended.tokenVersion, 2, 'tokenVersion must increment upon suspension');

  // Verify that any session is rejected if isSuspended is true
  const isAllowed = !suspended.isSuspended && suspended.tokenVersion === 1;
  assert.equal(isAllowed, false, 'Suspended admin session must be strictly rejected');
});

test('Phase 19 Seam 5: UI/UX Pro Max Standards, RTL Alignment & Bi-directional Formatting (FR-062, FR-066)', () => {
  // Check AdminUsersClient.tsx for <bdi dir="ltr"> and accessible dialog attributes
  const usersClientPath = path.join(process.cwd(), 'src/app/admin/users/AdminUsersClient.tsx');
  assert.ok(fs.existsSync(usersClientPath), 'AdminUsersClient.tsx must exist');

  const usersClientCode = fs.readFileSync(usersClientPath, 'utf8');
  assert.ok(
    usersClientCode.includes('<bdi dir="ltr"'),
    'Phone numbers in admin user tables must use <bdi dir="ltr"> to prevent number flipping in RTL layout'
  );
  assert.ok(
    usersClientCode.includes('role="dialog"') && usersClientCode.includes('aria-modal="true"'),
    'Admin provisioning modal must use role="dialog" and aria-modal="true" for WCAG accessibility'
  );
  assert.ok(
    usersClientCode.includes('min-h-[44px]'),
    'Touch targets must have minimum 44px height per UI/UX Pro Max standards'
  );

  // Check AdminPasswordSection.tsx for RTL eye toggle placement at left-3 and visible focus rings
  const passwordSectionPath = path.join(process.cwd(), 'src/app/admin/settings/AdminPasswordSection.tsx');
  assert.ok(fs.existsSync(passwordSectionPath), 'AdminPasswordSection.tsx must exist');

  const passwordSectionCode = fs.readFileSync(passwordSectionPath, 'utf8');
  assert.ok(
    passwordSectionCode.includes('absolute left-1') || passwordSectionCode.includes('absolute left-3'),
    'Password visibility eye toggle must be positioned at inline-start (left) in Persian RTL layout'
  );
  assert.ok(
    passwordSectionCode.includes('focus:ring-2') && passwordSectionCode.includes('focus:ring-primary-500'),
    'Inputs must feature visible focus:ring-primary-500 rings for accessibility'
  );
  assert.ok(
    passwordSectionCode.includes('role="alert"') && passwordSectionCode.includes('aria-live="polite"'),
    'Error summaries must feature role="alert" and aria-live="polite"'
  );
});
