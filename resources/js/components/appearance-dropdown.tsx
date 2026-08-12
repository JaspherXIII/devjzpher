import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const handleToggle = () => {
        if (appearance === 'dark') {
            updateAppearance('light');
        } else if (appearance === 'light') {
            updateAppearance('dark');
        } else {
            // If system, check current active mode
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateAppearance(isSystemDark ? 'light' : 'dark');
        }
    };

    return (
        <div className={className} {...props}>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggle}
                className="h-9 w-9 rounded-md text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                title="Toggle theme"
            >
                {appearance === 'dark' ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}
