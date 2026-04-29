import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <section className="min-h-screen w-full bg-background">
      <main className="w-full" aria-label="Dashboard content">
        <Outlet />
      </main>
    </section>
  );
}

export default Dashboard;
