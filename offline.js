const retry=document.getElementById('retry'),status=document.getElementById('status');
const offlineControlsReady=Boolean(retry&&status);

// Keep the static offline experience (including its safety link) usable even if
// cached HTML and JavaScript briefly come from different PWA versions.
if(offlineControlsReady){
  let reloading=false;
  async function hasRealConnection(){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),5000);
    try{
      const probe=`./?amyra-online-check=${Date.now()}`;
      const response=await fetch(probe,{cache:'no-store',credentials:'omit',redirect:'error',signal:controller.signal});
      return response.ok;
    }catch(_){return false}finally{clearTimeout(timeout)}
  }
  async function tryReconnect(){
    if(reloading)return;
    status.textContent='Verificando conexão…';
    retry.disabled=true;
    const online=await hasRealConnection();
    if(online){
      reloading=true;
      status.textContent='Conexão restabelecida. Abrindo a AMYRA…';
      location.replace('./');
      return;
    }
    status.textContent='Ainda sem conexão. Você pode continuar nesta pausa e tentar novamente depois.';
    retry.disabled=false;
    retry.focus();
  }
  retry.addEventListener('click',tryReconnect);
  window.addEventListener('online',()=>{
    status.textContent='A conexão parece ter voltado. Quando quiser, use “Tentar abrir a AMYRA novamente”.';
  });
}
