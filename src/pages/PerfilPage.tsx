import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/PageTransition';
import { 
  MessageSquare, 
  FileText, 
  Shield, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Trash2,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const menuItems = [
  { icon: MessageSquare, label: 'Deixar sugestão', action: 'sugestao' },
  { icon: FileText, label: 'Termos de Uso', action: 'termos' },
  { icon: Shield, label: 'Política de Privacidade', action: 'privacidade' },
  { icon: CreditCard, label: 'Dados trabalhistas e financeiros', action: 'dados' },
];

export default function PerfilPage() {
  const navigate = useNavigate();
  const { logout } = useApp();
  const { deleteAccount } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuClick = (action: string) => {
    if (action === 'sugestao') {
      navigate('/sugestao');
      return;
    }
    if (action === 'termos') {
      navigate('/termos-uso');
      return;
    }
    if (action === 'privacidade') {
      navigate('/politica-privacidade');
      return;
    }
    if (action === 'dados') {
      navigate('/dados-trabalhistas');
      return;
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteAccount();
      if (error) {
        toast.error('Erro ao excluir conta. Tente novamente.');
        return;
      }
      toast.success('Seus dados foram excluídos com sucesso.');
      logout();
      navigate('/login');
    } catch {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <PageTransition className="min-h-screen bg-background pb-24">
      <main className="max-w-md mx-auto px-4 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant={resolvedTheme === 'dark' ? 'dark' : 'light'} />
        </div>

        {/* Appearance Section */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Aparência
          </h3>
          
          <div className={cn(
            'flex items-center justify-between py-3.5 px-4',
            'bg-card rounded-xl shadow-card'
          )}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <ThemeIcon size={20} className="text-primary" />
              </div>
              <div>
                <span className="font-medium text-foreground text-sm block">Tema</span>
                <span className="text-xs text-muted-foreground">
                  {theme === 'system' ? 'Automático' : theme === 'dark' ? 'Escuro' : 'Claro'}
                </span>
              </div>
            </div>
            
            <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun size={14} />
                    <span>Claro</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon size={14} />
                    <span>Escuro</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor size={14} />
                    <span>Sistema</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Configurações
          </h3>
          
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            {menuItems.map(({ icon: Icon, label, action }, index) => (
              <button
                key={action}
                onClick={() => handleMenuClick(action)}
                className={cn(
                  'w-full flex items-center justify-between py-3.5 px-4',
                  'hover:bg-muted/50 transition-colors',
                  'active:bg-muted touch-manipulation min-h-[52px]',
                  index < menuItems.length - 1 && 'border-b border-border'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm">{label}</span>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Conta
          </h3>
          
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-3 py-3.5 px-4',
                'hover:bg-muted/50 transition-colors',
                'active:bg-muted touch-manipulation min-h-[52px]',
                'border-b border-border'
              )}
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <LogOut size={20} className="text-primary" />
              </div>
              <span className="font-medium text-foreground text-sm">Sair</span>
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className={cn(
                'w-full flex items-center gap-3 py-3.5 px-4',
                'hover:bg-destructive/10 transition-colors',
                'active:bg-destructive/20 touch-manipulation min-h-[52px]'
              )}
            >
              <div className="w-11 h-11 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-destructive" />
              </div>
              <span className="font-medium text-destructive text-sm">Excluir minha conta</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Excluir conta permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os seus dados, incluindo 
              consultas, propostas e informações pessoais serão permanentemente 
              removidos dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
