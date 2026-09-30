import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-6 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-gray-500 text-sm text-center md:text-left">
        © 2026 PrepPilot. All rights reserved.
      </p>

      <div className="flex gap-6 text-sm flex-wrap justify-center">
        <Link to="/terms" className="text-gray-400 hover:text-white transition">
          Terms & Conditions
        </Link>

        <Link
          to="/privacy"
          className="text-gray-400 hover:text-white transition"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
