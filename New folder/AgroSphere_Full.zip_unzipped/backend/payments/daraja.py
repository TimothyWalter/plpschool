
# Safaricom Daraja (STK Push) mock/stub
def stk_push(phone_number, amount, account_reference='AgroSphere'):
    # NOTE: Payments disabled in demo. Replace this with real implementation and credentials.
    return {'status':'mock','phone':phone_number,'amount':amount,'account_reference':account_reference,'transaction_id':'MOCK12345'}
