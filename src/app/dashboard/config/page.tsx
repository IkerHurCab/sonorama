"use client"

export function DashboardConfig() {

    const toggleDarkMode = (value: string) => {
        if(value == "dark"){
            document.documentElement.classList.toggle("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
    };
    return (
        <div className="relative p-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-30 mb-6">
                <div>
                    <h2 className="text-xl font-bold mb-4">Selecciona un tema</h2>
                    <select className="w-full p-2 border rounded-lg" onChange={(e) => {
                        toggleDarkMode(e.target.value)                  
                    }}>
                        <option value="base">Base</option>
                        <option id="darkmode" value="dark">Oscuro</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
