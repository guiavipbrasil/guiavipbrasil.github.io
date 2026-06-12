import { useParams, useLocation } from "wouter";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, X, Send, MapPin, ShieldCheck, Clock, Mail, Send as SendIcon, Heart, Star, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
  telegram?: string;
  email?: string;
}

type Mensagem = { tipo: "usuario" | "assistente"; texto: string };

const PIX_GLOBAL = "58e64b53-1ab7-443b-9495-46a5bf13057d";
const TOTAL_FOTOS = 1; // Simplificado para apenas 1 foto principal conforme pedido do usuário

const getProfileImageUrl = (perfil: Perfil, fotoIndex: number = 1) => {
  const ext = profileExtensions[perfil.id] || ".jpg";
  // Se for a foto principal (index 1), usa o formato padrão profile-{id}{ext}
  // Se fosse usar outras fotos, seria profile-{id}-{index}{ext}
  if (fotoIndex === 1) {
    return `/profile-images/profile-${perfil.id}${ext}`;
  }
  return `/profile-images/profile-${perfil.id}-${fotoIndex}${ext}`;
};

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sugestoes = [
  "Quer me chupar?",
  "Quanto custa?",
  "Tá disponível?",
  "Como funciona?",
];

function gerarResposta(perfil: Perfil, mensagem: string, valor?: number) {
  const texto = normalizar(mensagem);

  if (/\b(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|e aí|opa|e aew|oie|opa)\b/.test(texto)) {
    return `Oi, tudo bem? Sou ${perfil.nome}! 🔥 Vem conversar comigo, adoro conhecer gente interessante...`;
  }

  if (texto.includes("chupar") || texto.includes("boca") || texto.includes("lingua")) {
    return `Mmm, adoro chupar e gozar na boca! 💦 Quer me provar? Manda o PIX e a gente marca! 😈`;
  }

  if (texto.includes("cuzinho") || texto.includes("cu") || texto.includes("rabo")) {
    return `Ai, come meu cuzinho! 🍑 Que delicia... Quer experimentar? Manda o PIX de ${valor || 150} e vem me ver! 🔥`;
  }

  if (texto.includes("goza") || texto.includes("leite") || texto.includes("porra")) {
    return `Goza na minha boca, na minha bunda, onde você quiser! 💦 Vem logo, manda o PIX! 😈`;
  }

  if (texto.includes("valor") || texto.includes("preco") || texto.includes("quanto") || texto.includes("tabela")) {
    return `Os valores estão ali: 30min por R$${valor || 150}, 1h por R$${(valor || 150) + 130}, 2h por R$${(valor || 150) + 360}. Manda o PIX e vem me buscar! 🔥`;
  }

  if (texto.includes("disponivel") || texto.includes("hoje") || texto.includes("agora") || texto.includes("horario")) {
    return `Depende do dia, mas se você quiser, a gente marca! Manda a data, horário e o PIX que a gente combina tudo... 😉`;
  }

  if (texto.includes("pix") || texto.includes("pagamento") || texto.includes("transferencia")) {
    return `PIX: ${PIX_GLOBAL} - Manda o valor que você quer e vem me ver! Quanto mais você gasta, mais diversão! 💰🔥`;
  }

  if (texto.includes("cidade") || texto.includes("local") || texto.includes("onde")) {
    return `Estou em ${perfil.cidade}, pertinho de você! Quer vir me visitar? 🔥`;
  }

  if (texto.includes("atendimento") || texto.includes("servico") || texto.includes("faz o que")) {
    return `Ah, eu faço de tudo! Adoro dar o cuzinho, gozar na sua boca, sentar na sua cara... Qualquer coisa que você quiser, eu topo! 🍆💦`;
  }

  if (texto.includes("contato") || texto.includes("telegram") || texto.includes("falar")) {
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

  return `Interessante... me conta mais sobre isso? 😏 Ou quer marcar logo um horário pra gente se divertir? Manda o PIX! 🔥`;
}

export default function Perfil() {
  const { url_amigavel } = useParams();
  const [, setLocation] = useLocation();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [chatAberto, setChatAberto] = useState(true);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });
  const [pixCopiadoGlobal, setPixCopiadoGlobal] = useState(false);
  const [fotoAtual, setFotoAtual] = useState(1);
  const [fotosCarregadas, setFotosCarregadas] = useState<boolean[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const urlCompleta = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    fetch("/perfis.json")
      .then((res) => res.json())
      .then((data: Perfil[]) => {
        const p = data.find((item) => item.url_amigavel === url_amigavel);
        if (p) {
          setPerfil(p);
          setMensagens([{ tipo: "assistente", texto: `Oi! Sou ${p.nome}. Vem conversar comigo, adoro conhecer gente interessante... 😈` }]);
          setFotosCarregadas(new Array(TOTAL_FOTOS).fill(false));
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
        const valor = perfil.valores?.["30min"] || 150;
        setMensagens([...novasMensagens, { tipo: "assistente", texto: gerarResposta(perfil, texto, valor) }]);
      }
    }, 1000);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(PIX_GLOBAL);
    setPixCopiadoGlobal(true);
    setTimeout(() => setPixCopiadoGlobal(false), 3000);
  };

  const proximaFoto = () => {
    if (TOTAL_FOTOS <= 1) return;
    setFotoAtual((prev) => (prev === TOTAL_FOTOS ? 1 : prev + 1));
  };

  const fotoAnterior = () => {
    if (TOTAL_FOTOS <= 1) return;
    setFotoAtual((prev) => (prev === 1 ? TOTAL_FOTOS : prev - 1));
  };

  const handleFotoCarregada = (index: number) => {
    const novas = [...fotosCarregadas];
    novas[index] = true;
    setFotosCarregadas(novas);
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background site-shell">
        <p className="animate-pulse text-xl font-bold uppercase tracking-widest text-accent">Carregando...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center site-shell">
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
      <MetaTags title={`${perfil.nome} - Guia VIP Brasil`} description={perfil.descricao} image={getProfileImageUrl(perfil, 1)} />
      <div className="site-shell min-h-screen">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/40 backdrop-blur sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-semibold">Voltar</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Perfil Verificado</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl px-4 py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            
            {/* Coluna Esquerda - Galeria e Chat */}
            <div className="flex flex-col gap-6">
              
              {/* Galeria de Fotos */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 aspect-[3/4] group">
                {/* Foto Principal */}
                <div className="relative w-full h-full">
                  <img
                    key={`foto-${fotoAtual}`}
                    src={getProfileImageUrl(perfil, fotoAtual)}
                    alt={`${perfil.nome} - Foto ${fotoAtual}`}
                    className="w-full h-full object-cover animate-fade-in"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `/profile-images/profile-${perfil.id}.svg`;
                    }}
                    onLoad={() => handleFotoCarregada(fotoAtual - 1)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                </div>

                {/* Botões de Navegação */}
                {TOTAL_FOTOS > 1 && (
                  <>
                    <button
                      onClick={fotoAnterior}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={proximaFoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Indicador de Foto */}
                {TOTAL_FOTOS > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {Array.from({ length: TOTAL_FOTOS }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFotoAtual(idx + 1)}
                        className={`h-2 rounded-full transition-all ${
                          idx + 1 === fotoAtual ? "bg-accent w-6" : "bg-white/30 w-2 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Badge de Categoria */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                  </span>
                </div>

                {/* Contador de Fotos */}
                {TOTAL_FOTOS > 1 && (
                  <div className="absolute right-4 top-4 bg-black/60 px-3 py-1.5 rounded-full text-xs font-bold text-accent">
                    {fotoAtual}/{TOTAL_FOTOS}
                  </div>
                )}
              </div>

              {/* Chat Box */}
              {chatAberto && (
                <div className="chat-container w-full max-h-96 rounded-3xl overflow-hidden flex flex-col bg-black/80 border border-white/10">
                  <div className="chat-header flex items-center justify-between p-4 bg-gradient-to-r from-accent/20 to-accent/10 border-b border-white/10">
                    <h3 className="font-bold text-foreground">{perfil.nome}</h3>
                    <button onClick={() => setChatAberto(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
                    {mensagens.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.tipo === "usuario" ? "usuario" : "assistente"}`}>
                        {msg.texto}
                      </div>
                    ))}
                  </div>

                  <div className="chat-input-area p-4 bg-black/40 border-t border-white/10">
                    <div className="flex gap-2 mb-3">
                      {sugestoes.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => enviarMensagem(sug)}
                          className="text-xs bg-accent/20 hover:bg-accent/40 text-accent px-2 py-1 rounded-full transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMensagem}
                        onChange={(e) => setInputMensagem(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && enviarMensagem()}
                        placeholder="Escreva algo sexy..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent/50"
                      />
                      <Button onClick={() => enviarMensagem()} className="rounded-full h-10 w-10 p-0 btn-primary">
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita - Informações */}
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent">Perfil Premium</p>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground font-playfair">{perfil.nome}</h1>
                  </div>
                  <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    <Check className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Verificado</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <Heart className="h-3 w-3 text-accent" /> Sobre
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {perfil.descricao}
                    </p>
                  </section>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Localização</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{perfil.cidade}</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                        <Heart className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Categoria</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {perfil.categoria === "feminina" ? "Feminina" : "Trans"}
                      </p>
                    </div>
                  </div>

                  {/* PIX Section */}
                  <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-12 w-12" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="font-bold text-foreground">Pix para Confirmar</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chave PIX</label>
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-foreground">
                          <span className="flex-1 truncate">{PIX_GLOBAL}</span>
                        </div>
                      </div>
                      
                      <Button onClick={copiarPix} className="w-full btn-primary h-12 rounded-xl flex items-center justify-center gap-2">
                        {pixCopiadoGlobal ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copiar Chave PIX</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <section className="rounded-2xl border border-white/5 bg-white/5 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-accent" /> Como Funciona
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Escolha o valor desejado, mande o PIX e confirme o encontro. Quanto mais você gasta, mais diversão! 🔥
                    </p>
                  </section>

                  <div className="flex flex-col gap-3">
                    <Button onClick={() => setFormAberto(true)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground h-12 rounded-xl flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Formulário de Contato</span>
                    </Button>
                    <Button onClick={() => {
                      navigator.clipboard.writeText(urlCompleta);
                      alert("Link copiado!");
                    }} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground h-12 rounded-xl flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      <span>Compartilhar Perfil</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modal de Formulário */}
      {formAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-background p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-playfair">Falar com {perfil.nome}</h2>
              <button onClick={() => setFormAberto(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Seu Nome</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50"
                  placeholder="Como posso te chamar?"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail ou Telegram</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50"
                  placeholder="Para eu te responder..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mensagem</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 min-h-[100px]"
                  placeholder="O que você quer fazer comigo?"
                />
              </div>
              <Button onClick={() => {
                alert("Mensagem enviada! Aguarde meu retorno...");
                setFormAberto(false);
              }} className="w-full btn-primary h-12 rounded-xl">
                Enviar Mensagem 🔥
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
