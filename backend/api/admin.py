from django.contrib import admin
from .models import (
    UserProfile, Flight, Hotel, Event, Booking, 
    Payment, Refund, Deal, SupportTicket
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone', 'preferred_language', 'created_at']
    list_filter = ['role', 'preferred_language']
    search_fields = ['user__username', 'user__email', 'phone']

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ['flight_number', 'airline', 'origin', 'destination', 'departure_time', 'price_sar', 'available_seats', 'is_active']
    list_filter = ['airline', 'origin', 'destination', 'is_active']
    search_fields = ['flight_number', 'airline', 'origin', 'destination']

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'star_rating', 'price_per_night_sar', 'available_rooms', 'is_active']
    list_filter = ['city', 'star_rating', 'is_active']
    search_fields = ['name', 'city', 'address']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'city', 'event_date', 'price_sar', 'available_tickets', 'is_active']
    list_filter = ['category', 'city', 'is_active']
    search_fields = ['name', 'category', 'venue', 'city']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference', 'user', 'booking_type', 'status', 'total_price_sar', 'payment_status', 'created_at']
    list_filter = ['booking_type', 'status', 'payment_status', 'payment_method']
    search_fields = ['booking_reference', 'user__username', 'customer_email', 'customer_phone']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'booking', 'amount_sar', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'currency']
    search_fields = ['transaction_id', 'booking__booking_reference']

@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['booking', 'refund_amount_sar', 'status', 'processed_by', 'created_at']
    list_filter = ['status', 'currency']
    search_fields = ['booking__booking_reference', 'reason']

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ['title', 'deal_type', 'discount_percentage', 'discounted_price_sar', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['deal_type', 'is_active']
    search_fields = ['title', 'description']

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'user', 'subject', 'priority', 'status', 'assigned_to', 'created_at']
    list_filter = ['priority', 'status']
    search_fields = ['ticket_number', 'subject', 'user__username']
