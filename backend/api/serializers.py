from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Flight, Hotel, Event, Booking,
    Payment, Refund, Deal, SupportTicket
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role', 'phone', 'preferred_language', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['admin', 'staff', 'customer'], default='customer')
    phone = serializers.CharField(required=False, allow_blank=True)
    preferred_language = serializers.ChoiceField(choices=['en', 'ar'], default='en')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'preferred_language']
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'customer')
        phone = validated_data.pop('phone', '')
        preferred_language = validated_data.pop('preferred_language', 'en')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        UserProfile.objects.create(
            user=user,
            role=role,
            phone=phone,
            preferred_language=preferred_language
        )
        
        return user

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    flight_details = FlightSerializer(source='flight', read_only=True)
    hotel_details = HotelSerializer(source='hotel', read_only=True)
    event_details = EventSerializer(source='event', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'booking_reference', 'created_at', 'updated_at', 'user']

class PaymentSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']

class RefundSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    payment_details = PaymentSerializer(source='payment', read_only=True)
    processed_by_details = UserSerializer(source='processed_by', read_only=True)
    
    class Meta:
        model = Refund
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['id', 'ticket_number', 'created_at', 'updated_at']
