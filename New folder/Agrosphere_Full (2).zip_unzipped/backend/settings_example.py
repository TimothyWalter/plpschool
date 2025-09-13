
# Copy to settings.py and set env vars or edit values
SECRET_KEY='replace-me'
DEBUG=True
ALLOWED_HOSTS=['*']
MPESA_CONSUMER_KEY=''
MPESA_CONSUMER_SECRET=''
MPESA_SHORTCODE=''
MPESA_PASSKEY=''
MPESA_CALLBACK_URL='https://yourdomain.com/api/mpesa/callback/'
PAYPAL_CLIENT_ID=''
PAYPAL_SECRET=''
SUPABASE_URL=''
SUPABASE_KEY=''
DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':'db.sqlite3'}}
