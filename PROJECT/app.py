from flask import Flask, request, jsonify
import requests  # For API calls
import base64   # For auth

app = Flask(__name__)

# Placeholders for API keys (get from developer portals)
DARAJA_CONSUMER_KEY = 'your_daraja_key'
DARAJA_CONSUMER_SECRET = 'your_daraja_secret'
DARAJA_SHORTCODE = 'your_shortcode'
AIRTEL_CLIENT_ID = 'your_airtel_id'
AIRTEL_CLIENT_SECRET = 'your_airtel_secret'
PAYPAL_CLIENT_ID = 'your_paypal_id'
PAYPAL_SECRET = 'your_paypal_secret'
AFRICAS_TALKING_USERNAME = 'your_at_username'
AFRICAS_TALKING_API_KEY = 'your_at_key'
TRADER_PHONE = '254xxxxxxxxx'  # Trader's phone for notifications

# Function to get Daraja access token (M-Pesa)
def get_daraja_token():
    auth = base64.b64encode(f"{DARAJA_CONSUMER_KEY}:{DARAJA_CONSUMER_SECRET}".encode()).decode()
    headers = {'Authorization': f'Basic {auth}'}
    response = requests.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', headers=headers)
    return response.json()['access_token']

# Function to initiate M-Pesa STK Push
def initiate_mpesa_payment(phone, amount):
    token = get_daraja_token()
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {
        'BusinessShortCode': DARAJA_SHORTCODE,
        'Password': 'your_encoded_password',  # Generate per docs
        'Timestamp': 'timestamp_here',
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': amount,
        'PartyA': phone,
        'PartyB': DARAJA_SHORTCODE,
        'PhoneNumber': phone,
        'CallBackURL': 'https://your-site.com/mpesa_callback',  # Webhook for confirmation
        'AccountReference': 'Order123',
        'TransactionDesc': 'Payment for order'
    }
    response = requests.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', json=payload, headers=headers)
    return response.json()

# Similar for Airtel Money (based on developer portal)
def initiate_airtel_payment(phone, amount):
    # Get token first
    token_url = 'https://openapi.airtel.africa/auth/oauth2/token'
    token_payload = {
        'client_id': AIRTEL_CLIENT_ID,
        'client_secret': AIRTEL_CLIENT_SECRET,
        'grant_type': 'client_credentials'
    }
    token_response = requests.post(token_url, data=token_payload)
    token = token_response.json()['access_token']
    
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {
        'reference': 'Order123',
        'subscriber': {'country': 'KE', 'currency': 'KES', 'msisdn': phone[3:]},  # Remove +254
        'transaction': {'amount': amount, 'country': 'KE', 'currency': 'KES', 'id': 'unique_id'}
    }
    response = requests.post('https://openapi.airtel.africa/merchant/v1/payments/', json=payload, headers=headers)
    return response.json()

# PayPal payment creation (server-side)
def create_paypal_payment(amount):
    token_url = 'https://api.sandbox.paypal.com/v1/oauth2/token'
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_SECRET}".encode()).decode()
    headers = {'Authorization': f'Basic {auth}'}
    token_response = requests.post(token_url, data={'grant_type': 'client_credentials'}, headers=headers)
    token = token_response.json()['access_token']
    
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    payload = {
        'intent': 'sale',
        'payer': {'payment_method': 'paypal'},
        'transactions': [{'amount': {'total': str(amount), 'currency': 'USD' }}],  # Convert to USD if needed
        'redirect_urls': {'return_url': 'https://your-site.com/success', 'cancel_url': 'https://your-site.com/cancel'}
    }
    response = requests.post('https://api.sandbox.paypal.com/v1/payments/payment', json=payload, headers=headers)
    return response.json()

# Bank payments via IntaSend (example gateway for Kenyan banks)
def initiate_bank_payment(amount, bank_code):
    # IntaSend API (sign up at intasend.com)
    headers = {'Authorization': 'Bearer your_intasend_key', 'Content-Type': 'application/json'}
    payload = {
        'public_key': 'your_public_key',
        'amount': amount,
        'currency': 'KES',
        'method': 'BANK',  # Or 'PESALINK'
        'bank_code': bank_code  # e.g., 'KCB' for KCB
    }
    response = requests.post('https://sandbox.intasend.com/api/v1/checkout/', json=payload, headers=headers)
    return response.json()

# Send SMS via Africa's Talking
def send_sms(phone, message):
    headers = {'ApiKey': AFRICAS_TALKING_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
    payload = f'username={AFRICAS_TALKING_USERNAME}&to={phone}&message={message}&from=YourBrand'
    response = requests.post('https://api.sandbox.africastalking.com/version1/messaging', data=payload, headers=headers)
    return response.json()

# Webhook endpoint for payment confirmations (e.g., from M-Pesa)
@app.route('/mpesa_callback', methods=['POST'])
def mpesa_callback():
    data = request.json
    # Process confirmation, update order status
    if data['ResultCode'] == 0:
        order_id = data['CheckoutRequestID']  # Match to order
        send_sms('customer_phone', 'Payment received! Your order is being shipped.')
        send_sms(TRADER_PHONE, f'New order placed: {order_id}. Total: {data["Amount"]}')  # Notify trader via SMS
    return jsonify({'status': 'ok'})

# Similar webhook for other providers...

@app.route('/')
def home():
    return 'Welcome to the backend. Frontend at index.html'

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    total = data['total']
    # Assume user provides phone/email in real form
    phone = '254xxxxxxxxx'  # From user input
    # Offer payment options; here, example with M-Pesa
    response = initiate_mpesa_payment(phone, total)
    # Or Airtel: initiate_airtel_payment(phone, total)
    # Or PayPal: create_paypal_payment(total)
    # Or Bank: initiate_bank_payment(total, 'KCB')
    
    # On success, send initial SMS
    send_sms(phone, f'Order placed for KES {total}. Complete payment via prompt.')
    
    # Notify trader via webhook/API (here, SMS for simplicity; replace with your webhook)
    send_sms(TRADER_PHONE, f'New order: Total KES {total}. Items: {data["items"]}')
    
    return jsonify({'status': 'initiated', 'details': response})

if __name__ == '__main__':
    app.run(debug=True)