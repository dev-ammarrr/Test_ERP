from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Avg, Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import traceback

from .models import (
    UserProfile, Flight, Hotel, Event, Booking,
    Payment, Refund, Deal, SupportTicket
)
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    FlightSerializer, HotelSerializer, EventSerializer,
    BookingSerializer, PaymentSerializer, RefundSerializer,
    DealSerializer, SupportTicketSerializer
)

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            profile = request.user.profile
            return profile.role in ['admin', 'staff']
        except:
            return False

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': user.profile.role,
                    'name': f'{user.first_name} {user.last_name}'.strip() or user.username
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        
        print('=' * 60)
        print(f'🔐 LOGIN ATTEMPT')
        print(f'   Username/Email: {username}')
        print(f'   Password length: {len(password) if password else 0}')
        print('=' * 60)
        
        if not username or not password:
            print('❌ Missing credentials')
            return Response({'error': 'Username/email and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username, password=password)
        print(f'   Auth with username "{username}": {"✅ SUCCESS" if user else "❌ FAILED"}')
        
        if not user:
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    print(f'   Found user by email: {user_obj.username}')
                    user = authenticate(request, username=user_obj.username, password=password)
                    print(f'   Auth with found username "{user_obj.username}": {"✅ SUCCESS" if user else "❌ FAILED"}')
                except User.DoesNotExist:
                    print(f'❌ No user found with email: {username}')
            else:
                print(f'❌ No user found with username: {username}')
        
        if not user:
            print('❌ AUTHENTICATION FAILED')
            print('=' * 60)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f'✅ LOGIN SUCCESSFUL')
        print(f'   User ID: {user.id}')
        print(f'   Username: {user.username}')
        print(f'   Email: {user.email}')
        print('=' * 60)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'role': user.profile.role,
                'name': f'{user.first_name} {user.last_name}'.strip() or user.username
            }
        })
    except Exception as e:
        print(f'❌ LOGIN ERROR: {str(e)}')
        traceback.print_exc()
        print('=' * 60)
        return Response({'error': 'Login failed', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    try:
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': user.profile.role,
            'name': f'{user.first_name} {user.last_name}'.strip() or user.username
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_users(request):
    try:
        from django.contrib.auth import authenticate
        
        users = User.objects.all()
        test_user_exists = User.objects.filter(Q(username='testuser') | Q(email='test@example.com')).exists()
        
        auth_test_result = None
        if test_user_exists:
            try:
                test_user = User.objects.get(username='testuser')
                auth_test = authenticate(username='testuser', password='password123')
                auth_test_result = {
                    'canAuthenticate': auth_test is not None and auth_test.id == test_user.id,
                    'userExists': True,
                    'username': test_user.username,
                    'email': test_user.email,
                    'passwordIsHashed': test_user.password.startswith('pbkdf2_sha256$'),
                    'isStaff': test_user.is_staff,
                    'isSuperuser': test_user.is_superuser,
                    'hasProfile': hasattr(test_user, 'profile'),
                    'role': test_user.profile.role if hasattr(test_user, 'profile') else None
                }
            except User.DoesNotExist:
                auth_test_result = {'canAuthenticate': False, 'userExists': False, 'error': 'testuser not found'}
        else:
            auth_test_result = {'canAuthenticate': False, 'userExists': False, 'error': 'Test user does not exist. seed_auth.py may not have run!'}
        
        return Response({
            'totalUsers': users.count(),
            'testUserExists': test_user_exists,
            'testUserAuthStatus': auth_test_result,
            'seedScriptRan': test_user_exists,
            'users': [{
                'username': u.username,
                'email': u.email,
                'passwordIsHashed': u.password.startswith('pbkdf2_sha256$'),
                'hasProfile': hasattr(u, 'profile'),
                'role': u.profile.role if hasattr(u, 'profile') else None
            } for u in users[:5]]
        })
    except Exception as e:
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    try:
        user = request.user
        profile = user.profile
        
        if profile.role == 'customer':
            my_bookings = Booking.objects.filter(user=user)
            stats = {
                'totalBookings': my_bookings.count(),
                'confirmedBookings': my_bookings.filter(status='confirmed').count(),
                'pendingBookings': my_bookings.filter(status='pending').count(),
                'totalSpent': float(my_bookings.filter(status='confirmed').aggregate(Sum('total_price_sar'))['total_price_sar__sum'] or 0),
                'recentBookings': BookingSerializer(my_bookings.order_by('-created_at')[:5], many=True).data
            }
        else:
            stats = {
                'totalBookings': Booking.objects.count(),
                'confirmedBookings': Booking.objects.filter(status='confirmed').count(),
                'pendingBookings': Booking.objects.filter(status='pending').count(),
                'cancelledBookings': Booking.objects.filter(status='cancelled').count(),
                'totalRevenue': float(Booking.objects.filter(status='confirmed').aggregate(Sum('total_price_sar'))['total_price_sar__sum'] or 0),
                'totalFlights': Flight.objects.filter(is_active=True).count(),
                'totalHotels': Hotel.objects.filter(is_active=True).count(),
                'totalEvents': Event.objects.filter(is_active=True).count(),
                'totalUsers': User.objects.count(),
                'openSupportTickets': SupportTicket.objects.filter(status='open').count(),
                'activeDeals': Deal.objects.filter(is_active=True).count(),
                'recentBookings': BookingSerializer(Booking.objects.order_by('-created_at')[:10], many=True).data
            }
        
        return Response(stats)
    except Exception as e:
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrStaff()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Flight.objects.filter(is_active=True)
        origin = self.request.query_params.get('origin')
        destination = self.request.query_params.get('destination')
        
        if origin:
            queryset = queryset.filter(origin__icontains=origin)
        if destination:
            queryset = queryset.filter(destination__icontains=destination)
        
        return queryset.order_by('departure_time')

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrStaff()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Hotel.objects.filter(is_active=True)
        city = self.request.query_params.get('city')
        
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        return queryset.order_by('-star_rating')

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrStaff()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Event.objects.filter(is_active=True)
        city = self.request.query_params.get('city')
        category = self.request.query_params.get('category')
        
        if city:
            queryset = queryset.filter(city__icontains=city)
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        return queryset.order_by('event_date')

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role in ['admin', 'staff']:
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(user=user).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate that at least one of flight, hotel, or event is provided
            booking_type = request.data.get('booking_type')
            flight_id = request.data.get('flight')
            hotel_id = request.data.get('hotel')
            event_id = request.data.get('event')
            
            if booking_type == 'flight' and not flight_id:
                return Response({
                    'error': 'Flight ID is required for flight bookings'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if booking_type == 'hotel' and not hotel_id:
                return Response({
                    'error': 'Hotel ID is required for hotel bookings'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if booking_type == 'event' and not event_id:
                return Response({
                    'error': 'Event ID is required for event bookings'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate required fields
            required_fields = ['customer_name', 'customer_email', 'customer_phone', 'quantity', 'total_price_sar', 'total_price_usd', 'payment_method']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            
            if missing_fields:
                return Response({
                    'error': 'Missing required fields',
                    'missing_fields': missing_fields
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create booking
            booking = serializer.save(user=request.user)
            
            # Create payment
            try:
                payment = Payment.objects.create(
                    booking=booking,
                    amount_sar=booking.total_price_sar,
                    amount_usd=booking.total_price_usd,
                    currency=booking.currency,
                    payment_method=booking.payment_method,
                    status='completed'
                )
                
                booking.payment_status = 'completed'
                booking.status = 'confirmed'
                booking.confirmation_sent = True
                booking.ticket_issued = True
                booking.save()
            except Exception as e:
                # If payment creation fails, delete the booking
                booking.delete()
                return Response({
                    'error': 'Failed to create payment',
                    'details': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except Exception as e:
            traceback.print_exc()
            return Response({
                'error': 'Failed to create booking',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        try:
            booking = self.get_object()
            
            # Check if user owns the booking or is admin/staff
            if booking.user != request.user:
                if not (hasattr(request.user, 'profile') and request.user.profile.role in ['admin', 'staff']):
                    return Response({'error': 'You do not have permission to cancel this booking'}, status=status.HTTP_403_FORBIDDEN)
            
            if booking.status == 'cancelled':
                return Response({'error': 'Booking already cancelled'}, status=status.HTTP_400_BAD_REQUEST)
            
            if booking.status == 'refunded':
                return Response({'error': 'Cannot cancel a refunded booking'}, status=status.HTTP_400_BAD_REQUEST)
            
            booking.status = 'cancelled'
            booking.save()
            
            return Response({'message': 'Booking cancelled successfully', 'booking': BookingSerializer(booking).data})
        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role in ['admin', 'staff']:
            return Payment.objects.all().order_by('-created_at')
        return Payment.objects.filter(booking__user=user).order_by('-created_at')

class RefundViewSet(viewsets.ModelViewSet):
    queryset = Refund.objects.all()
    serializer_class = RefundSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role in ['admin', 'staff']:
            return Refund.objects.all().order_by('-created_at')
        return Refund.objects.filter(booking__user=user).order_by('-created_at')
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrStaff])
    def process(self, request, pk=None):
        refund = self.get_object()
        action = request.data.get('action')
        
        if action == 'approve':
            refund.status = 'completed'
            refund.processed_by = request.user
            refund.admin_notes = request.data.get('notes', '')
            refund.save()
            
            refund.booking.status = 'refunded'
            refund.booking.save()
            
            refund.payment.status = 'refunded'
            refund.payment.save()
            
            return Response({'message': 'Refund approved and processed', 'refund': RefundSerializer(refund).data})
        
        elif action == 'reject':
            refund.status = 'rejected'
            refund.processed_by = request.user
            refund.admin_notes = request.data.get('notes', '')
            refund.save()
            
            return Response({'message': 'Refund rejected', 'refund': RefundSerializer(refund).data})
        
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminOrStaff()]
        return [AllowAny()]
    
    def get_queryset(self):
        return Deal.objects.filter(is_active=True).order_by('-discount_percentage')

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.role in ['admin', 'staff']:
            return SupportTicket.objects.all().order_by('-created_at')
        return SupportTicket.objects.filter(user=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrStaff])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        
        try:
            assigned_user = User.objects.get(id=assigned_to_id)
            ticket.assigned_to = assigned_user
            ticket.status = 'in_progress'
            ticket.save()
            
            return Response({'message': 'Ticket assigned successfully', 'ticket': SupportTicketSerializer(ticket).data})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        ticket = self.get_object()
        
        ticket.status = 'resolved'
        ticket.resolution_notes = request.data.get('resolution_notes', '')
        ticket.save()
        
        return Response({'message': 'Ticket resolved successfully', 'ticket': SupportTicketSerializer(ticket).data})
