
import { Navbar } from "@/components/NavBar";
import Sidebar from "@/components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="flex h-screen">
                <Sidebar className="w-64 border-r" />
                <div className="flex flex-col flex-1">
                    <Navbar />
                    <div className="flex-1 p-6 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}