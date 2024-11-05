import { Outlet } from "react-router-dom";
import SidebarComponent from "../components/ui/SidebarComponent";
import NavbarComponent from "../components/ui/NavbarComponent";

export default function HomeLayout() {
  return (
    <section>
      <NavbarComponent />
      <main className="d-flex flex-row overflow-hidden vh-100">
        <SidebarComponent />
        <article className="w-100 overflow-auto p-3">
          <Outlet />
        </article>
      </main>
    </section>
  );
}
