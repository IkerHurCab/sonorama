interface LogoutButtonProps {
    onLogout: () => void;
}
export default function LogoutButton({ onLogout }: LogoutButtonProps) {
    return (
        <button
            onClick={onLogout}
            className="bg-white/20 my-4 py-1.5 px-6 mr-4 cursor-pointer rounded-sm transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)] hover:bg-white/40"
        >
            Logout
        </button>
    );
}