import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground font-sans">
            <main className="w-full max-w-none mx-auto p-4 md:p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
