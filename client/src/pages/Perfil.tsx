import { useParams, useLocation } from "wouter";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock } from "lucide-react";
import { MetaTags } from "@/components/MetaTags";
import { profileExtensions } from "../profileExtensions";
import { useState, useEffect, useRef } from "react";

interface Perfil {
  id: number;
  nome: string;
  categoria: "feminina" | "trans";
  cidade: string;
  descricao: string;
  foto_original: string;
  url_amigavel: string;
  valores?: { "30min": number; "1hora": number; "2horas": number };
  pix_chave?: string;
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

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí|opa|e aew|oie)\b/.test(texto)) {
    return `Oi, tudo bem? Sou ${perfil.nome}! 😈 Vem conversar comigo, adoro conhecer gente interessante...`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde")) {
    return `Estou em ${perfil.cidade}, pertinho de você! Quer vir me visitar? 🔥`;
  }

  if (texto.includes("disponivel") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario")) {
    return `Depende do dia, mas se você quiser, a gente marca! Me manda a data e horário que você quer, e a gente combina tudo... 😉`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("quanto") || texto.includes("tabela")) {
    return `Os valores estão ali na tabela, mas tudo depende do que você quer fazer comigo... Quanto mais tempo, mais diversão! 💦`;
  }

  if (texto.includes("atendimento") || texto.includes("servico") || texto.includes("faz o que")) {
    return `Ah, eu faço de tudo! Adoro dar o cuzinho, gozar na sua boca, sentar na sua cara... Qualquer coisa que você quiser, eu topo! 🍆💦`;
  }

  if (texto.includes("contato") || texto.includes("whatsapp") || texto.includes("falar")) {
    return `Aqui a gente já tá conversando! Mas se quiser me chamar de outro jeito, manda um PIX e a gente combina tudo direitinho... 😏`;
  }

  if (texto.includes("discreto") || texto.includes("sigilo") || texto.includes("privacidade")) {
    return `Claro! Tudo que acontecer entre a gente fica entre a gente. Sigilo total, sem preocupação! 🤐`;
  }

  if (texto.includes("perfil") || texto.includes("sobre") || texto.includes("quem")) {
    return `Sou ${perfil.nome}, uma gata de ${perfil.cidade} que adora sexo. Meu lema é: quanto mais safado, melhor! Vem comigo que você não vai se arrepender... 😘`;
  }

  if (texto.includes("seguro") || texto.includes("confiavel") || texto.includes("real")) {
    return `Pode confiar! Sou real, minhas fotos são todas recentes. Já atendi muita gente e todos voltam querendo mais! 🔥`;
  }

  if (texto.includes("obrigado") || texto.includes("valeu")) {
    return `De nada, babe! Qualquer dúvida, é só chamar. Estou aqui pra te deixar louco de tesão! 😈`;
  }

  if (texto.includes("fotos") || texto.includes("foto") || texto.includes("imagem")) {
    return `As fotos são todas minhas mesmo, recentes e gostosas! Quer mais? Vem me ver pessoalmente que é muito melhor... 📸🔥`;
  }

  if (texto.includes("primeira vez")) {
    return `Primeira vez? Sem problema! Eu vou te ensinar tudo que você precisa saber... e muito mais! 😉💦`;
  }

  if (texto.includes("casal")) {
    return `Amo casais! A gente faz uma putaria gostosa mesmo. Me chama que a gente combina tudo! 🔥`;
  }

  if (texto.includes("hotel") || texto.includes("motel") || texto.includes("lugar")) {
    return `Posso ir no seu lugar ou você vem aqui. Tanto faz, desde que a gente fique sozinho pra fazer putaria! 😈`;
  }

  return `Interessante... me conta mais sobre isso? 😏 Ou quer marcar logo um horário pra gente se divertir? 🔥`;
}

export default function Perfil() {
  const { url_amigavel } = useParams();
  const [, setLocation] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const urlCompleta = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const p = data.find((item) => item.url_amigavel === url_amigavel);
        if (p) {
          setPerfil(p);
          setMensagens([{ tipo: "assistente", texto: `Olá! Sou ${p.nome}. Como posso te deixar louco hoje? 😈` }]);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
        setCarregando(false);
      });
  }, [url_amigavel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = (textoOverride?: string) => {
    const texto = textoOverride || inputMensagem;
    if (!texto.trim()) return;

    const novasMensagens: Mensagem[] = [...mensagens, { tipo: "usuario", texto }];
    setMensagens(novasMensagens);
    setInputMensagem("");

    setTimeout(() => {
      if (perfil) {
        setMensagens([...novasMensagens, { tipo: "assistente", texto: gerarResposta(perfil, texto) }]);
      }
    }, 1000);
  };

  const copiarPix = () => {
    if (perfil?.pix_chave) {
      navigator.clipboard.writeText(perfil.pix_chave);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="animate-pulse text-xl font-bold uppercase tracking-widest text-accent">Carregando...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Perfil não encontrado</h1>
        <p className="mb-8 text-muted-foreground">O perfil que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => setLocation("/")} className="btn-primary px-8">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <>
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={getProfileImageUrl(perfil)} />
      <div className="site-shell min-h-screen">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="container flex items-center justify-between py-4">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao guia</span>
            </button>
          </div>
        </header>

        <main className="container py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10" style={{ maxHeight: '100vh' }}>
                <img
                  src={getProfileImageUrl(perfil)}
                  alt={`${perfil.nome} em ${perfil.cidade}`}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur">
                  {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-1 md:p-3">
              <div>
                <p className="eyebrow mb-3">Perfil VIP</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-foreground md:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {perfil.nome}
                  </h1>
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-3 py-1 text-xs font-bold text-black uppercase tracking-wider">
                    <span>✓</span>
                    <span>Verificado</span>
                  </div>
                </div>
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
                <div className="rounded-2xl border-2 border-pink-500/60 bg-gradient-to-r from-pink-600/20 to-pink-500/10 p-6 shadow-lg shadow-pink-500/20">
                  <p className="mb-5 text-center text-lg font-bold uppercase tracking-[0.2em] text-pink-400">💰 Tabela de Valores 💰</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">30 MINUTOS</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["30min"]}</p>
                    </div>
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">1 HORA</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["1hora"]}</p>
                    </div>
                    <div className="rounded-xl border-2 border-pink-400/50 bg-pink-500/15 p-4 text-center hover:scale-105 transition-transform">
                      <p className="text-sm font-bold text-pink-200">2 HORAS</p>
                      <p className="mt-3 text-3xl font-black text-pink-300">R$ {perfil.valores["2horas"]}</p>
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
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3"
                  onClick={copiarPix}
                >
                  {pixCopiado ? '✓ PIX Copiado!' : '💰 Copiar PIX'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const texto = `Confira ${perfil.nome} no Guia VIP Brasil`;
                    if (navigator.share) {
                      navigator.share({ title: `${perfil.nome} - Guia VIP Brasil`, text: texto, url: urlCompleta });
                    }
                  }}
                >
                  Compartilhar Perfil
                </Button>
              </div>
            </div>
          </div>
        </main>

        {chatAberto && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm md:items-center md:justify-center">
            <div className="chat-container w-full max-w-md max-h-[80vh] md:rounded-3xl overflow-hidden flex flex-col">
              <div className="chat-header flex items-center justify-between p-4 bg-pink-900/40">
                <h3 className="text-pink-300 font-bold">{perfil.nome}</h3>
                <button onClick={() => setChatAberto(false)} className="text-pink-300 hover:text-pink-100 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="chat-messages flex-1 overflow-y-auto p-4" ref={scrollRef}>
                {mensagens.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.tipo === "usuario" ? "usuario" : "assistente"}`}>
                    {msg.texto}
                  </div>
                ))}
              </div>

              <div className="chat-input-area p-4 bg-black/40 border-t border-white/10">
                <div className="chat-input flex gap-2">
                  <input
                    type="text"
                    value={inputMensagem}
                    onChange={(e) => setInputMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                    placeholder="Escreva algo sexy..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-pink-500"
                  />
                  <button onClick={() => enviarMensagem()} className="rounded-full bg-pink-600 hover:bg-pink-700 p-2 text-white transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {sugestoes.length > 0 && (
                  <div className="chat-suggestions flex flex-wrap gap-2 mt-3">
                    {sugestoes.map((sugestao, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMensagem(sugestao);
                          setTimeout(() => enviarMensagem(sugestao), 0);
                        }}
                        className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-muted-foreground transition-colors"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rodapé Profissional */}
        <footer className="border-t border-white/10 bg-black/60 backdrop-blur py-12 mt-16">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3 mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Guia VIP Brasil</h3>
                <p className="text-sm text-muted-foreground">Portal premium de acompanhantes de luxo em todo o Brasil. Discrição e profissionalismo garantidos.</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent mb-3 uppercase">Informações</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-accent transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
                </ul>
              </div>
              <div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">⚠️ Aviso Importante</p>
                  <p className="text-xs text-red-300">Este site é destinado exclusivamente a maiores de 18 anos. Ao acessar, você confirma ser maior de idade.</p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8">
              <p className="text-center text-xs text-muted-foreground">© 2026 Guia VIP Brasil. Todos os direitos reservados. | Conteúdo adulto - Proibido para menores de 18 anos.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
