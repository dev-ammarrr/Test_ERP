from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'flights', views.FlightViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'refunds', views.RefundViewSet)
router.register(r'deals', views.DealViewSet)
router.register(r'support-tickets', views.SupportTicketViewSet)

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/register', views.register),
    path('auth/login/', views.login, name='login'),
    path('auth/login', views.login),
    path('auth/me/', views.me, name='me'),
    path('auth/me', views.me),
    path('auth/debug/users/', views.debug_users, name='debug_users'),
    path('auth/debug/users', views.debug_users),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('dashboard-stats', views.dashboard_stats),
    path('', include(router.urls)),
]
