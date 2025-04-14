
const supabaseUrl = 'https://zggspgyosbscnuroursp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZ3NwZ3lvc2JzY251cm91cnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Mjk3NTAsImV4cCI6MjA2MDAwNTc1MH0.ZpRtHZRv3Ds4OyXhibW2N034l2S7IhdgFz0nFyelvrA';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// (OBS: Esta URL e a chave de API é pública e não privada, estão sendo usadas diretamente no front-end) APENAS para fins de teste e não ADMINISTRATIVA.

async function executarLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginSenha').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Erro ao logar: " + error.message);
  } else {
   
    window.location.href = 'listagem.html';
  }
}


async function executarCadastro() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  if (!data?.user) {
    alert("Erro ao criar utilizador.");
    return;
  }

  const { error: insertError } = await supabase.from('users').insert({
    id: data.user.id,
    email,
    nome,
    tipo: 'cliente',
  });

  if (insertError) {
    alert("Erro ao salvar no banco de dados: " + insertError.message);
  } else {
    
    window.location.href = 'index.html';
  }
}


async function listarPrestadores() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('tipo', 'prestador');

  if (error) {
    console.error("Erro ao listar prestadores:", error.message);
    return;
  }

  console.log(data); 
}


async function agendar(prestadorId, dataAgendamento, hora, descricao) {
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    alert("Utilizador não autenticado.");
    return;
  }

  await supabase.from('bookings').insert({
    cliente_id: userData.user.id,
    prestador_id: prestadorId,
    data: dataAgendamento,
    hora,
    descricao,
    status: 'pendente'
  });

  alert("Agendamento realizado!");
  window.location.href = 'listagem.html';
}
