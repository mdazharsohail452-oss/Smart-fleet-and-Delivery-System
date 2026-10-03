function Navbar() {

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            <h2 className="text-xl font-semibold">
                Dashboard
            </h2>

            <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    A
                </div>

                <span className="font-medium">
                    Admin
                </span>

            </div>

        </header>
    );
}

export default Navbar;