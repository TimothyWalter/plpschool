
# M-Pesa Daraja live template (fill env vars)
import requests, base64, datetime
MPESA_OAUTH_URL = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
MPESA_STK_URL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
def get_token(key, secret):
    r = requests.get(MPESA_OAUTH_URL, auth=(key, secret)); r.raise_for_status(); return r.json()['access_token']
def stk_push(key, secret, shortcode, passkey, phone, amount, callback):
    token = get_token(key, secret); ts = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    pwd = base64.b64encode((shortcode+passkey+ts).encode()).decode()
    headers={'Authorization':f'Bearer {token}'}
    payload={ "BusinessShortCode": shortcode, "Password": pwd, "Timestamp": ts, "TransactionType":"CustomerPayBillOnline", "Amount":int(amount), "PartyA":phone, "PartyB":shortcode, "PhoneNumber":phone, "CallBackURL": callback, "AccountReference":"AgroSphere", "TransactionDesc":"Payment" }
    r = requests.post(MPESA_STK_URL, json=payload, headers=headers); return r.json()
