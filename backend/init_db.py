#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookme.settings')
django.setup()

from api.models import Flight, Hotel, Event, Deal
from django.utils import timezone

print('=' * 60)
print('🚀 BOOKME DATABASE INITIALIZATION')
print('=' * 60)

Flight.objects.all().delete()
Hotel.objects.all().delete()
Event.objects.all().delete()
Deal.objects.all().delete()

print('\n✈️ Creating flights...')
flights_data = [
    {
        'airline': 'Saudia',
        'flight_number': 'SV1234',
        'origin': 'Riyadh',
        'destination': 'Jeddah',
        'departure_time': timezone.now() + timedelta(days=7, hours=8),
        'arrival_time': timezone.now() + timedelta(days=7, hours=10),
        'price_sar': 450.00,
        'price_usd': 120.00,
        'available_seats': 85,
        'total_seats': 150,
        'aircraft_type': 'Boeing 777',
        'baggage_allowance': '2 pieces, 23kg each',
        'is_active': True
    },
    {
        'airline': 'Flynas',
        'flight_number': 'XY5678',
        'origin': 'Jeddah',
        'destination': 'Dubai',
        'departure_time': timezone.now() + timedelta(days=10, hours=14),
        'arrival_time': timezone.now() + timedelta(days=10, hours=17),
        'price_sar': 850.00,
        'price_usd': 227.00,
        'available_seats': 120,
        'total_seats': 180,
        'aircraft_type': 'Airbus A320',
        'baggage_allowance': '1 piece, 20kg',
        'is_active': True
    },
    {
        'airline': 'Saudia',
        'flight_number': 'SV9012',
        'origin': 'Riyadh',
        'destination': 'Cairo',
        'departure_time': timezone.now() + timedelta(days=5, hours=22),
        'arrival_time': timezone.now() + timedelta(days=6, hours=1),
        'price_sar': 1200.00,
        'price_usd': 320.00,
        'available_seats': 45,
        'total_seats': 200,
        'aircraft_type': 'Boeing 787 Dreamliner',
        'baggage_allowance': '2 pieces, 32kg each',
        'is_active': True
    },
    {
        'airline': 'Flynas',
        'flight_number': 'XY3456',
        'origin': 'Dammam',
        'destination': 'Riyadh',
        'departure_time': timezone.now() + timedelta(days=3, hours=6),
        'arrival_time': timezone.now() + timedelta(days=3, hours=7, minutes=30),
        'price_sar': 380.00,
        'price_usd': 101.00,
        'available_seats': 95,
        'total_seats': 150,
        'aircraft_type': 'Airbus A320',
        'baggage_allowance': '1 piece, 20kg',
        'is_active': True
    },
    {
        'airline': 'Saudia',
        'flight_number': 'SV7890',
        'origin': 'Jeddah',
        'destination': 'London',
        'departure_time': timezone.now() + timedelta(days=15, hours=23),
        'arrival_time': timezone.now() + timedelta(days=16, hours=6),
        'price_sar': 3500.00,
        'price_usd': 933.00,
        'available_seats': 30,
        'total_seats': 250,
        'aircraft_type': 'Boeing 777-300ER',
        'baggage_allowance': '2 pieces, 32kg each',
        'is_active': True
    }
]

for flight_data in flights_data:
    flight = Flight.objects.create(**flight_data)
    print(f'   ✅ {flight.airline} {flight.flight_number}: {flight.origin} → {flight.destination} (SAR {flight.price_sar})')

print('\n🏨 Creating hotels...')
hotels_data = [
    {
        'name': 'Ritz-Carlton Riyadh',
        'city': 'Riyadh',
        'address': 'Al Hada Area, Mekkah Road, Riyadh 11493',
        'star_rating': 5,
        'description': 'Luxurious 5-star hotel in the heart of Riyadh featuring elegant rooms with marble bathrooms, multiple dining options including international cuisine, a world-class spa, outdoor pool, and state-of-the-art fitness center. Perfect for business and leisure travelers seeking premium hospitality.',
        'amenities': 'Free WiFi, Swimming Pool, Spa, Fitness Center, Restaurant, Room Service, Valet Parking, Concierge, Business Center',
        'price_per_night_sar': 1200.00,
        'price_per_night_usd': 320.00,
        'available_rooms': 45,
        'total_rooms': 120,
        'check_in_time': '15:00:00',
        'check_out_time': '12:00:00',
        'cancellation_policy': 'Free cancellation up to 48 hours before check-in. Late cancellation or no-show: 1 night charge.',
        'is_active': True
    },
    {
        'name': 'Jeddah Hilton',
        'city': 'Jeddah',
        'address': 'Corniche Road, Jeddah 23212',
        'star_rating': 4,
        'description': 'Modern 4-star beachfront hotel offering stunning Red Sea views, spacious rooms with contemporary design, multiple restaurants serving Arabic and international cuisine, private beach access, and excellent conference facilities. Ideal for both families and business travelers.',
        'amenities': 'Free WiFi, Beach Access, Pool, Gym, Restaurant, Bar, Meeting Rooms, Parking, Kids Club',
        'price_per_night_sar': 750.00,
        'price_per_night_usd': 200.00,
        'available_rooms': 68,
        'total_rooms': 200,
        'check_in_time': '14:00:00',
        'check_out_time': '12:00:00',
        'cancellation_policy': 'Free cancellation up to 24 hours before check-in. Late cancellation: 50% charge.',
        'is_active': True
    },
    {
        'name': 'Al Faisaliah Hotel',
        'city': 'Riyadh',
        'address': 'King Fahd Road, Olaya District, Riyadh 11533',
        'star_rating': 5,
        'description': 'Iconic luxury hotel in Riyadh\'s prestigious Al Faisaliah Tower, featuring opulent suites with panoramic city views, award-winning restaurants, exclusive spa treatments, indoor pool, and personalized butler service. Experience unparalleled elegance and Saudi hospitality.',
        'amenities': 'Free WiFi, Indoor Pool, Luxury Spa, Fine Dining, Butler Service, Limousine Service, Business Lounge, Helipad',
        'price_per_night_sar': 1800.00,
        'price_per_night_usd': 480.00,
        'available_rooms': 25,
        'total_rooms': 80,
        'check_in_time': '15:00:00',
        'check_out_time': '13:00:00',
        'cancellation_policy': 'Free cancellation up to 72 hours before check-in. Late cancellation: full charge.',
        'is_active': True
    },
    {
        'name': 'Movenpick Hotel Dammam',
        'city': 'Dammam',
        'address': 'King Abdulaziz Road, Dammam 32214',
        'star_rating': 4,
        'description': 'Contemporary 4-star hotel in Dammam\'s business district, offering comfortable rooms with modern amenities, rooftop pool with city views, international buffet restaurant, well-equipped gym, and flexible meeting spaces. Great value for business and leisure stays.',
        'amenities': 'Free WiFi, Rooftop Pool, Restaurant, Gym, Business Center, Free Parking, Laundry Service',
        'price_per_night_sar': 650.00,
        'price_per_night_usd': 173.00,
        'available_rooms': 82,
        'total_rooms': 150,
        'check_in_time': '14:00:00',
        'check_out_time': '12:00:00',
        'cancellation_policy': 'Free cancellation up to 24 hours before check-in.',
        'is_active': True
    },
    {
        'name': 'Park Hyatt Jeddah',
        'city': 'Jeddah',
        'address': 'Al Hamra Corniche, Jeddah 23423',
        'star_rating': 5,
        'description': 'Sophisticated 5-star marina resort featuring elegant rooms and suites with Red Sea or marina views, multiple gourmet dining venues, luxurious spa with traditional hammam, infinity pool, private yacht berths, and exclusive beach club. Perfect for discerning travelers.',
        'amenities': 'Free WiFi, Marina, Private Beach, Infinity Pool, Spa & Hammam, Fine Dining, Yacht Club, Water Sports, Valet',
        'price_per_night_sar': 1500.00,
        'price_per_night_usd': 400.00,
        'available_rooms': 38,
        'total_rooms': 100,
        'check_in_time': '15:00:00',
        'check_out_time': '12:00:00',
        'cancellation_policy': 'Free cancellation up to 48 hours before check-in. Late cancellation: 1 night charge.',
        'is_active': True
    }
]

for hotel_data in hotels_data:
    hotel = Hotel.objects.create(**hotel_data)
    print(f'   ✅ {hotel.name} ({hotel.star_rating}⭐): {hotel.city} - SAR {hotel.price_per_night_sar}/night')

print('\n🎭 Creating events...')
events_data = [
    {
        'name': 'Riyadh Season 2024 - Grand Opening',
        'category': 'Entertainment',
        'venue': 'Boulevard Riyadh City',
        'city': 'Riyadh',
        'description': 'Experience the spectacular grand opening of Riyadh Season 2024, featuring world-class performances, celebrity appearances, stunning fireworks display, interactive zones, and exclusive entertainment. A celebration of culture, music, and innovation that brings together the best of global entertainment in the heart of Saudi Arabia.',
        'event_date': timezone.now() + timedelta(days=20, hours=19),
        'duration_hours': 4.5,
        'price_sar': 250.00,
        'price_usd': 67.00,
        'available_tickets': 1500,
        'total_tickets': 5000,
        'age_restriction': 'All ages welcome',
        'is_active': True
    },
    {
        'name': 'Saudi International Golf Tournament',
        'category': 'Sports',
        'venue': 'Royal Greens Golf & Country Club',
        'city': 'Jeddah',
        'description': 'Witness world-renowned professional golfers compete in this prestigious PGA-sanctioned tournament on the stunning Red Sea coast. Enjoy championship golf, exclusive hospitality areas, meet-and-greet opportunities with players, and breathtaking views of the course and sea.',
        'event_date': timezone.now() + timedelta(days=30, hours=8),
        'duration_hours': 8.0,
        'price_sar': 400.00,
        'price_usd': 107.00,
        'available_tickets': 800,
        'total_tickets': 2000,
        'age_restriction': '12+',
        'is_active': True
    },
    {
        'name': 'Jeddah Food Festival 2024',
        'category': 'Food & Culinary',
        'venue': 'Jeddah Waterfront',
        'city': 'Jeddah',
        'description': 'Indulge in a gastronomic journey featuring over 100 local and international food vendors, celebrity chef demonstrations, cooking workshops, live entertainment, and family-friendly activities. Discover traditional Saudi cuisine alongside global flavors in a vibrant waterfront setting.',
        'event_date': timezone.now() + timedelta(days=14, hours=17),
        'duration_hours': 6.0,
        'price_sar': 150.00,
        'price_usd': 40.00,
        'available_tickets': 2500,
        'total_tickets': 8000,
        'age_restriction': 'All ages',
        'is_active': True
    },
    {
        'name': 'Formula E Diriyah E-Prix',
        'category': 'Sports',
        'venue': 'Diriyah Street Circuit',
        'city': 'Riyadh',
        'description': 'Experience the thrill of electric racing at the iconic UNESCO World Heritage site of Diriyah. Watch cutting-edge electric race cars compete on a challenging street circuit, enjoy fan zones, interactive exhibits, and witness the future of motorsport in a historic setting.',
        'event_date': timezone.now() + timedelta(days=45, hours=15),
        'duration_hours': 7.0,
        'price_sar': 600.00,
        'price_usd': 160.00,
        'available_tickets': 1200,
        'total_tickets': 10000,
        'age_restriction': '8+',
        'is_active': True
    },
    {
        'name': 'Saudi Comic Con 2024',
        'category': 'Entertainment',
        'venue': 'Riyadh International Convention Center',
        'city': 'Riyadh',
        'description': 'The ultimate pop culture celebration featuring comic book artists, cosplay competitions, gaming tournaments, celebrity panels, exclusive merchandise, anime screenings, and meet-and-greets with international stars. A must-attend event for fans of comics, movies, gaming, and anime.',
        'event_date': timezone.now() + timedelta(days=25, hours=10),
        'duration_hours': 10.0,
        'price_sar': 180.00,
        'price_usd': 48.00,
        'available_tickets': 3000,
        'total_tickets': 15000,
        'age_restriction': 'All ages',
        'is_active': True
    }
]

for event_data in events_data:
    event = Event.objects.create(**event_data)
    print(f'   ✅ {event.name}: {event.city} - {event.category} - SAR {event.price_sar}')

print('\n💰 Creating deals...')
deals_data = [
    {
        'title': 'Early Bird Flight Special - 30% Off',
        'description': 'Book your domestic flights at least 14 days in advance and save 30% on all Saudia and Flynas routes. Valid for travel between Riyadh, Jeddah, and Dammam. Limited seats available.',
        'deal_type': 'flight',
        'discount_percentage': 30.00,
        'original_price_sar': 450.00,
        'discounted_price_sar': 315.00,
        'original_price_usd': 120.00,
        'discounted_price_usd': 84.00,
        'valid_from': timezone.now(),
        'valid_until': timezone.now() + timedelta(days=30),
        'terms_conditions': 'Valid for bookings made at least 14 days before departure. Non-refundable. Subject to availability.',
        'is_active': True
    },
    {
        'title': 'Weekend Hotel Getaway - 40% Off',
        'description': 'Enjoy luxury weekend stays at participating 4 and 5-star hotels in Riyadh and Jeddah. Book Friday-Saturday nights and save 40%. Includes complimentary breakfast and late checkout.',
        'deal_type': 'hotel',
        'discount_percentage': 40.00,
        'original_price_sar': 1200.00,
        'discounted_price_sar': 720.00,
        'original_price_usd': 320.00,
        'discounted_price_usd': 192.00,
        'valid_from': timezone.now(),
        'valid_until': timezone.now() + timedelta(days=60),
        'terms_conditions': 'Valid for Friday-Saturday stays only. Minimum 2-night booking required. Free cancellation up to 24 hours.',
        'is_active': True
    },
    {
        'title': 'Riyadh Season Pass - Buy 2 Get 1 Free',
        'description': 'Purchase tickets to any two Riyadh Season events and get a third event ticket absolutely free. Mix and match from concerts, sports, and entertainment events.',
        'deal_type': 'event',
        'discount_percentage': 33.33,
        'original_price_sar': 750.00,
        'discounted_price_sar': 500.00,
        'original_price_usd': 200.00,
        'discounted_price_usd': 133.00,
        'valid_from': timezone.now(),
        'valid_until': timezone.now() + timedelta(days=90),
        'terms_conditions': 'Valid for Riyadh Season events only. All three events must be booked in single transaction. Non-transferable.',
        'is_active': True
    },
    {
        'title': 'Family Package - Flight + Hotel + Event',
        'description': 'Complete family vacation package including round-trip flights, 3-night hotel stay, and event tickets for up to 4 people. Save 35% compared to booking separately.',
        'deal_type': 'package',
        'discount_percentage': 35.00,
        'original_price_sar': 5000.00,
        'discounted_price_sar': 3250.00,
        'original_price_usd': 1333.00,
        'discounted_price_usd': 867.00,
        'valid_from': timezone.now(),
        'valid_until': timezone.now() + timedelta(days=45),
        'terms_conditions': 'Valid for family of 4 (2 adults, 2 children). Must book all components together. Flexible dates available.',
        'is_active': True
    },
    {
        'title': 'Last Minute Hotel Deals - Up to 50% Off',
        'description': 'Book hotels for same-day or next-day check-in and enjoy massive savings. Select properties in Riyadh, Jeddah, and Dammam offering up to 50% off standard rates.',
        'deal_type': 'hotel',
        'discount_percentage': 50.00,
        'original_price_sar': 800.00,
        'discounted_price_sar': 400.00,
        'original_price_usd': 213.00,
        'discounted_price_usd': 107.00,
        'valid_from': timezone.now(),
        'valid_until': timezone.now() + timedelta(days=7),
        'terms_conditions': 'Valid for same-day or next-day bookings only. Limited availability. No cancellations or modifications.',
        'is_active': True
    }
]

for deal_data in deals_data:
    deal = Deal.objects.create(**deal_data)
    print(f'   ✅ {deal.title}: {deal.discount_percentage}% off - SAR {deal.discounted_price_sar}')

print('\n✅ DATABASE INITIALIZATION COMPLETED!')
print('=' * 60)
print(f'   Flights: {Flight.objects.count()}')
print(f'   Hotels: {Hotel.objects.count()}')
print(f'   Events: {Event.objects.count()}')
print(f'   Deals: {Deal.objects.count()}')
print('=' * 60)
