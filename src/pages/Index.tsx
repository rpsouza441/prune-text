import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Moon, Sun, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ThemeMode = "system" | "light" | "dark";

const Index = () => {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [result, setResult] = useState("");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme-mode");
    return (saved as ThemeMode) || "system";
  });
  const { toast } = useToast();
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Normalize text for comparison (remove accents, lowercase)
  const normalizeText = (text: string): { normalized: string; indexMap: number[] } => {
    const indexMap: number[] = [];
    let normalized = "";
    
    const nfd = text.normalize("NFD");
    
    for (let i = 0; i < nfd.length; i++) {
      const char = nfd[i];
      // Skip combining marks (diacritics)
      if (/\p{M}/u.test(char)) {
        continue;
      }
      indexMap.push(i);
      normalized += char.toLowerCase();
    }
    
    return { normalized, indexMap };
  };

  // Check if character is a word character (letters, marks, numbers)
  const isWordChar = (char: string | undefined): boolean => {
    if (!char) return false;
    return /[\p{L}\p{M}\p{N}]/u.test(char);
  };

  // Apply system theme preference
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(themeMode === "dark");
    }
  }, [themeMode]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  // Auto-process with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (textA && textB.trim()) {
        processRemoval(true);
      } else if (!textB.trim()) {
        setResult("");
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [textA, textB]);

  // Remove all occurrences of textB from textA
  const processRemoval = (silent: boolean = false) => {
    if (!textB.trim()) {
      if (!silent) {
        toast({
          title: "Erro",
          description: "O trecho a remover (B) não pode estar vazio.",
          variant: "destructive",
        });
      }
      return;
    }

    if (textB.length > 10000) {
      if (!silent) {
        toast({
          title: "Erro",
          description: "O trecho B é muito longo (máximo 10.000 caracteres).",
          variant: "destructive",
        });
      }
      return;
    }

    const { normalized: aNorm, indexMap: aMap } = normalizeText(textA);
    const { normalized: bNorm } = normalizeText(textB);

    if (bNorm.length === 0) {
      toast({
        title: "Erro",
        description: "O trecho B normalizado resultou vazio.",
        variant: "destructive",
      });
      return;
    }

    // Find all non-overlapping occurrences
    const ranges: Array<[number, number]> = [];
    let pos = 0;

    while (pos <= aNorm.length - bNorm.length) {
      const idx = aNorm.indexOf(bNorm, pos);
      if (idx === -1) break;

      const startNorm = idx;
      const endNorm = idx + bNorm.length;

      // Check word boundaries
      const leftOk = startNorm === 0 || !isWordChar(aNorm[startNorm - 1]);
      const rightOk = endNorm === aNorm.length || !isWordChar(aNorm[endNorm]);

      if (leftOk && rightOk) {
        // Map back to original indices
        // Find original start position
        let startOrig = 0;
        for (let i = 0; i < aMap.length; i++) {
          if (i === startNorm) {
            startOrig = aMap[i];
            break;
          }
        }

        // Find original end position
        let endOrig = textA.length;
        if (endNorm < aMap.length) {
          endOrig = aMap[endNorm];
        } else {
          // Beyond normalized length, use text end
          endOrig = textA.length;
        }

        // Adjust for NFD -> original mapping
        // We need to find the actual character boundaries in original text
        const textANFD = textA.normalize("NFD");
        
        // Find where the match actually ends in original coordinates
        let origEndSearch = startOrig;
        let normCount = 0;
        for (let i = startOrig; i < textANFD.length && normCount < bNorm.length; i++) {
          if (!/\p{M}/u.test(textANFD[i])) {
            normCount++;
          }
          origEndSearch = i + 1;
        }

        ranges.push([startOrig, origEndSearch]);
        pos = endNorm;
      } else {
        pos = startNorm + 1;
      }
    }

    if (ranges.length === 0) {
      setResult(textA);
      if (!silent) {
        toast({
          title: "Nenhuma ocorrência encontrada",
          description: "O trecho B não foi encontrado em A como palavra inteira.",
        });
      }
      return;
    }

    // Build result by excluding the ranges
    const textANFD = textA.normalize("NFD");
    const parts: string[] = [];
    let lastEnd = 0;

    for (const [start, end] of ranges) {
      if (start > lastEnd) {
        parts.push(textANFD.slice(lastEnd, start));
      }
      lastEnd = end;
    }

    if (lastEnd < textANFD.length) {
      parts.push(textANFD.slice(lastEnd));
    }

    const resultText = parts.join("").normalize("NFC");
    setResult(resultText);
    
    if (!silent) {
      toast({
        title: "Sucesso",
        description: `${ranges.length} ocorrência(s) removida(s).`,
      });
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copiado!",
      description: "Resultado copiado para a área de transferência.",
    });
  };

  const clearAll = () => {
    setTextA("");
    setTextB("");
    setResult("");
    toast({
      title: "Limpo",
      description: "Todos os campos foram limpos.",
    });
  };

  const cycleTheme = () => {
    const modes: ThemeMode[] = ["system", "light", "dark"];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
  };

  const getThemeIcon = () => {
    if (themeMode === "light") return <Sun className="h-5 w-5" />;
    if (themeMode === "dark") return <Moon className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      processRemoval(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                RemoveText
              </h1>
              <p className="text-muted-foreground mt-1">
                Remova trechos específicos do seu texto com precisão
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              className="theme-toggle"
              aria-label={`Tema: ${themeMode}`}
              title={`Tema atual: ${themeMode === "system" ? "Sistema" : themeMode === "light" ? "Claro" : "Escuro"}`}
            >
              {getThemeIcon()}
            </Button>
          </header>

          {/* Main Content */}
          <div className="space-y-6" onKeyDown={handleKeyDown}>
            {/* Text A */}
            <div className="space-y-2 card-container">
              <Label htmlFor="textA" className="text-lg font-semibold">
                Texto completo (A)
              </Label>
              <Textarea
                id="textA"
                placeholder="Cole ou digite o texto completo aqui..."
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                className="min-h-[200px] resize-y input-elegant"
                aria-label="Texto completo para processar"
              />
            </div>

            {/* Text B */}
            <div className="space-y-2 card-container">
              <Label htmlFor="textB" className="text-lg font-semibold">
                Trecho a remover (B)
              </Label>
              <Textarea
                id="textB"
                placeholder="Digite o trecho que deseja remover..."
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                className="min-h-[80px] resize-y input-elegant"
                aria-label="Trecho a ser removido"
              />
              <p className="text-sm text-muted-foreground">
                O trecho será removido automaticamente de forma case-insensitive, ignorando acentos e apenas como palavra inteira.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={clearAll} variant="outline" size="lg" className="flex-1 sm:flex-none">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
              <p className="text-sm text-muted-foreground">
                Ctrl+Enter para reprocessar manualmente
              </p>
            </div>

            {/* Result */}
            <div className="space-y-2 card-container">
              <div className="flex items-center justify-between">
                <Label htmlFor="result" className="text-lg font-semibold">
                  Resultado (C)
                </Label>
                <Button
                  onClick={copyResult}
                  variant="ghost"
                  size="sm"
                  disabled={!result}
                  className="btn-copy"
                  aria-label="Copiar resultado"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
              </div>
              <Textarea
                id="result"
                value={result}
                readOnly
                className="min-h-[200px] resize-y bg-muted/50 input-result"
                placeholder="O resultado aparecerá aqui..."
                aria-label="Texto resultado"
                aria-readonly="true"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-muted-foreground">
            <p>100% no navegador • Sem dependências externas • Privacidade total</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
