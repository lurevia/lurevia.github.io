import React from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./nav/BottomNav";
import { Footer } from "./Footer"; 
import { Outlet } from "react-router-dom";

export const MainLayout: React.FC = () => {
    return (
        <div className="h-svh w-screen flex flex-col overflow-hidden">

            <Navbar />
            

            <main className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col justify-between">
                
                <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto w-full flex-1">
                    <Outlet />
                </div>

                <Footer />
                
            </main>
            
            <BottomNav />

        </div>
    );
};
