#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookme.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile

print('=' * 60)
print('🔐 BOOKME AUTH SEED SCRIPT STARTING')
print('=' * 60)

if User.objects.filter(username='testuser').exists():
    user = User.objects.get(username='testuser')
    print('✅ Test user already exists')
    print(f'📧 Email: {user.email}')
    print(f'👤 Username: {user.username}')
    print('🔑 Password: password123')
    print(f'🔐 Password hash: {user.password[:30]}...')
    print(f'👥 Role: {user.profile.role}')
    print('=' * 60)
    sys.exit(0)

print('🔐 Creating test user...')
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='password123',
    first_name='Test',
    last_name='User'
)
user.is_staff = True
user.is_superuser = True
user.save()

UserProfile.objects.create(
    user=user,
    role='customer',
    phone='+966501234567',
    preferred_language='en'
)

print('✅ Test user created!')
print(f'📧 Email: {user.email}')
print(f'👤 Username: {user.username}')
print('🔑 Password: password123')
print(f'🔐 Password hash: {user.password[:30]}...')
print(f'👥 Role: {user.profile.role}')

print('🔍 Verifying authentication works...')
from django.contrib.auth import authenticate
test_auth = authenticate(username='testuser', password='password123')
if test_auth and test_auth.id == user.id:
    print('✅ VERIFICATION SUCCESS: Test user can be authenticated!')
    print('🎯 Login will work with: testuser / password123')
else:
    print('❌ VERIFICATION FAILED: Test user created but authentication test FAILED!')
    print('   This indicates a problem - user may not be able to login!')
    sys.exit(1)

print('\n🔐 Creating admin user...')
admin_user = User.objects.create_user(
    username='admin',
    email='admin@bookme.sa',
    password='admin123',
    first_name='Admin',
    last_name='User'
)
admin_user.is_staff = True
admin_user.is_superuser = True
admin_user.save()

UserProfile.objects.create(
    user=admin_user,
    role='admin',
    phone='+966507654321',
    preferred_language='en'
)

print('✅ Admin user created!')
print(f'📧 Email: {admin_user.email}')
print(f'👤 Username: {admin_user.username}')
print('🔑 Password: admin123')
print(f'👥 Role: {admin_user.profile.role}')

print('\n🔐 Creating staff user...')
staff_user = User.objects.create_user(
    username='staff',
    email='staff@bookme.sa',
    password='staff123',
    first_name='Staff',
    last_name='Member'
)
staff_user.is_staff = True
staff_user.save()

UserProfile.objects.create(
    user=staff_user,
    role='staff',
    phone='+966509876543',
    preferred_language='en'
)

print('✅ Staff user created!')
print(f'📧 Email: {staff_user.email}')
print(f'👤 Username: {staff_user.username}')
print('🔑 Password: staff123')
print(f'👥 Role: {staff_user.profile.role}')

print('\n✅ SEED SCRIPT COMPLETED SUCCESSFULLY!')
print('=' * 60)
print('\n📋 TEST CREDENTIALS:')
print('   Customer: testuser / password123')
print('   Admin: admin / admin123')
print('   Staff: staff / staff123')
print('=' * 60)
