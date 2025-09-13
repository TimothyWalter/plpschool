
document.addEventListener('DOMContentLoaded', ()=>{
  // cart demo
  renderCartCount(); document.querySelectorAll('.add-cart').forEach(b=> b.addEventListener('click', (e)=>{ addToCart({sku:e.target.dataset.sku,name:e.target.dataset.name,price:Number(e.target.dataset.price)}) }));
  document.getElementById('chatBtn')?.addEventListener('click', ()=>{ const w=document.getElementById('chatWindow'); w.style.display = w.style.display==='flex' ? 'none' : 'flex'; });
  document.getElementById('chatSend')?.addEventListener('click', ()=>{ const i=document.getElementById('chatInput'); sendChat(i.value); i.value=''; });
});

function addToCart(item){
  const cart = JSON.parse(localStorage.getItem('agro_cart')||'[]'); cart.push(item); localStorage.setItem('agro_cart', JSON.stringify(cart)); renderCartCount(); renderCartDropdown();
}
function renderCartCount(){ const cart = JSON.parse(localStorage.getItem('agro_cart')||'[]'); document.querySelectorAll('.cart-count').forEach(el=>el.textContent=cart.length); }
function renderCartDropdown(){ const cart = JSON.parse(localStorage.getItem('agro_cart')||'[]'); const c=document.getElementById('cartItems'); if(!c) return; c.innerHTML=''; if(cart.length===0){ c.innerHTML='<p style="color:#aaa">Cart empty</p>'; document.getElementById('cartFooter').innerHTML=''; return; } cart.forEach(it=>{ const d=document.createElement('div'); d.textContent=it.name+' - KSh '+it.price; c.appendChild(d); }); const total=cart.reduce((s,i)=>s+i.price,0); document.getElementById('cartFooter').innerHTML='<div><strong>Total:</strong> KSh '+total.toFixed(0)+'</div>'; }
function sendChat(msg){ if(!msg) return; const box=document.getElementById('chatMessages'); box.innerHTML += '<div><strong>You:</strong> '+msg+'</div>'; setTimeout(()=>{ box.innerHTML += '<div><strong>AgroBot:</strong> Thanks, demo support will contact you.</div>'; box.scrollTop=box.scrollHeight; },700); }
