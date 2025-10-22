
import { useLanguage } from "@/context/LanguageContext";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanguageDropdown() {
  const { lang, setLang, availableLangs } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center px-2">
          <Globe className="w-5 h-5 mr-2" />
          <span className="capitalize">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableLangs.map(l => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
