
# PayPal live template (server-side)
import requests
def create_order(client_id, secret, amount, currency='USD'):
    token = requests.post('https://api-m.paypal.com/v1/oauth2/token', data={'grant_type':'client_credentials'}, auth=(client_id, secret)).json()['access_token']
    headers={'Authorization':f'Bearer {token}'}
    payload={"intent":"CAPTURE","purchase_units":[{"amount":{"currency_code":currency,"value":str(amount)}}]}
    r = requests.post('https://api-m.paypal.com/v2/checkout/orders', json=payload, headers=headers); return r.json()
