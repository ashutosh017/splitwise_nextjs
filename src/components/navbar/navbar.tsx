import { cookies } from "next/headers";
import ClientNavbar from "./client_navbar";
import { verifyToken } from "../../app/actions/auth";

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return <ClientNavbar isLoggedIn={false} name={null} />;

    const result = await verifyToken({ token });

    if (!result.success) {
        return <ClientNavbar isLoggedIn={false} name={null} />;
    }

    return <ClientNavbar isLoggedIn={true} name={result.data.name} />;
}