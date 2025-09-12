
from django.http import JsonResponse
from .daraja import stk_push
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def initiate_stk_push(request):
    if request.method != 'POST':
        return JsonResponse({'error':'POST required'}, status=400)
    data = json.loads(request.body.decode('utf-8'))
    phone = data.get('phone')
    amount = data.get('amount')
    if not phone or not amount:
        return JsonResponse({'error':'phone & amount required'}, status=400)
    res = stk_push(phone, amount)
    return JsonResponse(res)
