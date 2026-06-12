import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";
import { profileExtensions } from "../profileExtensions";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
  valores?: { "30min": number; "1hora": number; "2horas": number };
}

type Mensagem = { tipo: "usuario" | "assistente"; texto: string };

const getProfileImageUrl = (perfil: Perfil) => {
  const ext = profileExtensions[perfil.id] || ".svg";
  return `/profile-images/profile-${perfil.id}${ext}`;
};

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sugestoes = [
  "Está disponível hoje?",
  "Qual cidade atende?",
  "Como funciona o contato?",
  "Quero saber mais sobre discrição",
  "Qual é o valor?",
  "Como é o atendimento?",
];

function gerarResposta(perfil: Perfil, mensagem: string) {
  const texto = normalizar(mensagem);
  const saudacao = `Olá! Sou o assistente virtual de ${perfil.nome}.`;

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí|opa|e aew|oie)\b/.test(texto)) {
    return `${saudacao} Bem-vindo! Posso responder dúvidas sobre localização (${perfil.cidade}), disponibilidade, valores, atendimento, discrição e como entrar em contato. O que você gostaria de saber?`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde") || texto.includes("endereco") || texto.includes("endereço") || texto.includes("localizacao") || texto.includes("localização")) {
    return `${perfil.nome} atende em ${perfil.cidade}. Para confirmar se faz atendimento em bairros específicos ou cidades próximas, envie uma mensagem com sua localização.`;
  }

  if (texto.includes("disponivel") || texto.includes("disponibilidade") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario") || texto.includes("horário") || texto.includes("que horas") || texto.includes("quando")) {
    return `A disponibilidade de ${perfil.nome} varia conforme o dia. Para confirmar um horário específico, envie: a data desejada, o horário e a duração que você procura. Quanto mais antecedência, melhor!`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("preço") || texto.includes("custa") || texto.includes("cache") || texto.includes("cachê") || texto.includes("quanto") || texto.includes("tabela") || texto.includes("investimento")) {
    return `Os valores de ${perfil.nome} são competitivos e variam conforme a duração e tipo de atendimento. Para uma cotação personalizada, informe: duração desejada (1h, 2h, etc), tipo de atendimento e se é primeira vez.`;
  }

  if (texto.includes("atendimento") || texto.includes("o que oferece") || texto.includes("servico") || texto.includes("serviço") || texto.includes("faz o que") || texto.includes("oferece")) {
    return `${perfil.nome} oferece atendimento VIP discreto e profissional. Os detalhes específicos dos serviços são melhor discutidos em uma conversa privada. Envie uma mensagem com suas preferências e ${perfil.nome} responderá com as opções disponíveis.`;
  }

  if (texto.includes("whatsapp") || texto.includes("telefone") || texto.includes("contato") || texto.includes("falar") || texto.includes("mensagem") || texto.includes("como falo") || texto.includes("como entro em contato")) {
    return `Para falar com ${perfil.nome}, envie uma mensagem clara, respeitosa e objetiva. Inclua: seu nome, a cidade onde você está, data e horário desejados. ${perfil.nome} responderá assim que possível com as informações completas.`;
  }

  if (texto.includes("discreto") || texto.includes("discricao") || texto.includes("discrição") || texto.includes("sigilo") || texto.includes("privacidade") || texto.includes("confidencial") || texto.includes("segredo")) {
    return `${perfil.nome} valoriza muito discrição e confidencialidade. Todas as informações pessoais são tratadas com total sigilo. Evite compartilhar dados sensíveis desnecessariamente e combine tudo com discrição.`;
  }

  if (texto.includes("perfil") || texto.includes("sobre") || texto.includes("descricao") || texto.includes("descrição") || texto.includes("quem") || texto.includes("quem e") || texto.includes("me fale sobre")) {
    return `${perfil.nome} é um perfil ${perfil.categoria === "feminina" ? "feminino" : "trans"} em ${perfil.cidade}. Descrição: ${perfil.descricao}. Para saber mais detalhes ou tirar dúvidas, envie uma mensagem!`;
  }

  if (texto.includes("seguro") || texto.includes("segurança") || texto.includes("seguranca") || texto.includes("golpe") || texto.includes("confiavel") || texto.includes("confiável") || texto.includes("pode confiar") || texto.includes("real")) {
    return `${perfil.nome} é um perfil verificado no Guia VIP Brasil. Para sua segurança: confirme informações antes de qualquer deslocamento, mantenha a conversa respeitosa, e combine todos os detalhes com clareza.`;
  }

  if (texto.includes("obrigado") || texto.includes("obrigada") || texto.includes("valeu") || texto.includes("obg") || texto.includes("vlw")) {
    return `Por nada! Se tiver mais dúvidas sobre ${perfil.nome}, estou aqui para ajudar. Pergunte sobre cidade, horários, valores, atendimento ou qualquer outra informação!`;
  }

  if (texto.includes("fotos") || texto.includes("foto") || texto.includes("imagem") || texto.includes("como e") || texto.includes("aparencia")) {
    return `As fotos no perfil de ${perfil.nome} são recentes e refletem a realidade. Para mais imagens ou detalhes visuais, entre em contato direto com ${perfil.nome}.`;
  }

  if (texto.includes("primeira vez") || texto.includes("nunca fiz") || texto.includes("inexperiente") || texto.includes("iniciante")) {
    return `Sem problemas! ${perfil.nome} é atenciosa e sabe lidar com clientes de primeira viagem. Envie uma mensagem explicando que é sua primeira vez, e ${perfil.nome} fará tudo para que seja uma experiência confortável e memorável.`;
  }

  if (texto.includes("casal") || texto.includes("acompanhante") || texto.includes("companhia") || texto.includes("evento") || texto.includes("sair")) {
    return `${perfil.nome} oferece atendimento VIP. Para eventos, saídas ou acompanhamento especial, envie uma mensagem com os detalhes do que você procura, data, horário e duração desejada.`;
  }

  if (texto.includes("hotel") || texto.includes("motel") || texto.includes("seu lugar") || texto.includes("meu lugar")) {
    return `${perfil.nome} pode atender em diversos locais. Para confirmar opções de local (hotel, motel, residencial), envie uma mensagem com suas preferências e ${perfil.nome} indicará as melhores opções.`;
  }

  const respostasGerais = [
    `${saudacao} Posso ajudar com informações sobre localização (${perfil.cidade}), disponibilidade, valores, tipo de atendimento, discrição e como entrar em contato. O que você gostaria de saber?`,
    `Entendi sua pergunta! Para uma resposta mais completa, posso ajudar com: localização, horários, valores, tipos de atendimento, segurança, discrição ou detalhes do perfil de ${perfil.nome}. Qual desses interessa?`,
    `${perfil.nome} está em ${perfil.cidade} e oferece atendimento VIP profissional. Posso responder dúvidas sobre disponibilidade, valores, atendimento, segurança e como fazer o primeiro contato.`,
    `Boa pergunta! Para uma resposta mais precisa, me diga se você quer saber sobre: onde ${perfil.nome} atende, horários disponíveis, valores, tipo de atendimento, ou como entrar em contato.`,
    `Posso ajudar! ${perfil.nome} está disponível para atendimento VIP em ${perfil.cidade}. Pergunte sobre horários, valores, tipos de serviço, ou como fazer contato direto.`
  ];

  return respostasGerais[Math.floor(Math.random() * respostasGerais.length)];
}

export default function Perfil() {
  const { url } = useParams();
  const [, navigate] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const encontrado = data.find((p) => p.url_amigavel === url);
        if (encontrado) {
          setPerfil(encontrado);
          setMensagens([
            {
              tipo: "assistente",
              texto: `Olá! Sou o assistente virtual de ${encontrado.nome}. Pergunte sobre disponibilidade, cidade, contato, discrição ou detalhes do perfil.`,
            },
          ]);
        } else {
          setErro(true);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setErro(true);
        setCarregando(false);
      });
  }, [url]);

  const enviarMensagem = (textoPersonalizado?: string) => {
    if (!perfil) return;

    const texto = (textoPersonalizado ?? inputMensagem).trim();
    if (!texto) return;

    setMensagens((prev) => [...prev, { tipo: "usuario", texto }]);
    setInputMensagem("");

    window.setTimeout(() => {
      setMensagens((prev) => [...prev, { tipo: "assistente", texto: gerarResposta(perfil, texto) }]);
    }, 500);
  };

  if (carregando) {
    return (
      <div className="site-shell flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="site-shell flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-muted-foreground">Perfil não encontrado.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const urlCompleta = typeof window !== "undefined" ? window.location.href : "";
  const imagemCompartilhamento = getProfileImageUrl(perfil);

  return (
    <div className="site-shell min-h-screen bg-background">
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={imagemCompartilhamento} url={urlCompleta} type="article" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="container py-4">
          <Button onClick={() => navigate("/")} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao guia
          </Button>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="profile-detail-card grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-3xl bg-muted">
            <img src={getProfileImageUrl(perfil)} alt={`${perfil.nome} em ${perfil.cidade}`} className="h-full min-h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
            <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
              {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
            </span>
          </div>

          <div className="flex flex-col gap-6 p-1 md:p-3">
            <div>
              <p className="eyebrow mb-3">Perfil VIP</p>
              <h1 className="text-4xl font-bold text-foreground md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {perfil.nome}
              </h1>
              <div className="accent-line mt-5" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="info-card">
                <MapPin className="h-5 w-5 text-accent" />
                <span>Localização</span>
                <strong>{perfil.cidade}</strong>
              </div>
              <div className="info-card">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span>Atendimento</span>
                <strong>Reservado</strong>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Sobre</p>
              <p className="leading-8 text-foreground/90">{perfil.descricao}</p>
            </div>

            {perfil.valores && (
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Tabela de Valores</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-accent/20 bg-accent/10 p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">30 minutos</p>
                    <p className="mt-2 text-2xl font-bold text-accent">R$ {perfil.valores["30min"]}</p>
                  </div>
                  <div className="rounded-lg border border-accent/20 bg-accent/10 p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">1 hora</p>
                    <p className="mt-2 text-2xl font-bold text-accent">R$ {perfil.valores["1hora"]}</p>
                  </div>
                  <div className="rounded-lg border border-accent/20 bg-accent/10 p-3 text-center">
                    <p className="text-xs font-semibold text-muted-foreground">2 horas</p>
                    <p className="mt-2 text-2xl font-bold text-accent">R$ {perfil.valores["2horas"]}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 font-semibold text-foreground"><Clock className="h-4 w-4 text-accent" />Dica para contato</div>
              Envie uma mensagem educada, com cidade, dia e horário desejados. Assim o atendimento tende a ser mais rápido e organizado.
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button className="w-full btn-primary" onClick={() => setChatAberto(true)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Conversar Agora
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const texto = `Confira ${perfil.nome} no Guia VIP Brasil`;
                  if (navigator.share) {
                    navigator.share({ title: `${perfil.nome} - Guia VIP Brasil`, text: texto, url: urlCompleta });
                  } else {
                    navigator.clipboard?.writeText(urlCompleta);
                    alert("Link copiado para a área de transferência.");
                  }
                }}
              >
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </main>

      {chatAberto && (
        <div className="chat-panel fixed bottom-4 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl md:right-6">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-amber-600 to-yellow-500 p-4 text-black">
            <div>
              <h3 className="font-bold">Assistente Virtual</h3>
              <p className="text-xs font-semibold opacity-80">Respondendo por {perfil.nome}</p>
            </div>
            <button onClick={() => setChatAberto(false)} className="rounded-full p-2 transition hover:bg-black/10" aria-label="Fechar chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
            {mensagens.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.tipo === "usuario" ? "justify-end" : "justify-start"} animate-fadeInUp`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 transition-all duration-300 ${msg.tipo === "usuario" ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" : "bg-white/[0.08] text-foreground border border-white/10"}`}>
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {sugestoes.map((sugestao) => (
                <button key={sugestao} onClick={() => enviarMensagem(sugestao)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground transition hover:border-accent hover:text-foreground">
                  {sugestao}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMensagem}
                onChange={(e) => setInputMensagem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                placeholder="Digite sua pergunta..."
                className="flex-1 rounded-xl border border-white/10 bg-background px-3 py-3 text-sm outline-none transition focus:border-accent"
              />
              <Button size="sm" onClick={() => enviarMensagem()} className="h-auto px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!chatAberto && (
        <button onClick={() => setChatAberto(true)} className="fixed bottom-5 right-5 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-[0_18px_45px_rgba(217,159,73,0.34)] transition hover:-translate-y-1" title="Abrir chat com assistente virtual">
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
