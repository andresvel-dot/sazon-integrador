import { useState } from 'react';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const MOMENTOS = [
  { id: 'Desayuno', label: 'Desayuno' },
  { id: 'Almuerzo', label: 'Almuerzo' },
  { id: 'Merienda', label: 'Merienda' },
  { id: 'Cena', label: 'Cena' }
];

export default function PlanSemanal() {
  // Estado para el menú lateral (Sidebar)
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // Estado global para el Modo Día / Noche en toda la pantalla
  const [modoOscuro, setModoOscuro] = useState(false);

  const cambiarTema = (esOscuro) => {
    setModoOscuro(esOscuro);
    if (esOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Estado de navegación por pestañas del planificador
  const [vistaActiva, setVistaActiva] = useState('calendario');

  // Estado CRUD del Calendario Semanal
  const [calendario, setCalendario] = useState({
    'Lunes-Desayuno': 'Pasta cremosa con Salchicha Ranchera Zenú'
  });
  const [recetaInput, setRecetaInput] = useState('');
  const [seleccionActual, setSeleccionActual] = useState({ dia: 'Lunes', momento: 'Desayuno' });
  
  // Estado para Cronograma Diario
  const [diaCronograma, setDiaCronograma] = useState('Lunes');

  // Estado para Buscador de Recetas (insensible a mayúsculas/minúsculas)
  const [filtroReceta, setFiltroReceta] = useState('');
  const recetasBase = [
    'Pasta cremosa con Salchicha Ranchera Zenú',
    'Arepa con Queso y Chocolate Noel',
    'Arroz con Pollo Doria',
    'Ensalada César con Pechuga Pietrán'
  ];

  const recetasFiltradas = recetasBase.filter(r => 
    r.toLowerCase().includes(filtroReceta.toLowerCase())
  );

  // Estado para Plantillas & Menús
  const [busquedaPlan, setBusquedaPlan] = useState('');
  const [planesGuardados, setPlanesGuardados] = useState([
    { id: 'semana-principal', nombre: 'Semana Principal', activo: true },
    { id: 'semana-fitness-01', nombre: 'Semana Fitness 01', activo: false }
  ]);

  // Alerta personalizada (Sin usar alert nativo)[cite: 8, 10]
  const [toast, setToast] = useState('');
  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(''), 3000);
  };

  // CRUD: Asignar receta
  const handleAsignarReceta = (e) => {
    e.preventDefault();
    if (!recetaInput.trim()) return;

    const clave = `${seleccionActual.dia}-${seleccionActual.momento}`;
    setCalendario({
      ...calendario,
      [clave]: recetaInput.trim()
    });
    setRecetaInput('');
    mostrarToast(`Receta asignada a ${seleccionActual.dia} (${seleccionActual.momento})`);
  };

  // CRUD: Eliminar receta
  const handleEliminarReceta = (dia, momento) => {
    const clave = `${dia}-${momento}`;
    const nuevoCalendario = { ...calendario };
    delete nuevoCalendario[clave];
    setCalendario(nuevoCalendario);
    mostrarToast('Receta eliminada del plan');
  };

  // CRUD: Vaciar semana
  const handleVaciarSemana = () => {
    setCalendario({});
    mostrarToast('Semana vaciada con éxito');
  };

  const totalBloques = DIAS.length * MOMENTOS.length;
  const recetasAgendadasCount = Object.keys(calendario).length;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${modoOscuro ? 'bg-[#1B4332] text-white' : 'bg-[#F4F4E8] text-[#3F4040]'}`}>
      
      {/* Alerta Toast del Sistema */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#7FBA00] text-[#1B4332] px-4 py-3 rounded-xl shadow-2xl font-mono-tag text-xs font-bold border border-white/25">
          🔔 {toast}
        </div>
      )}

      {/* HEADER SUPERIOR */}
      <header id="top-header" className={`sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300 ${modoOscuro ? 'bg-[#133326]/95 border-b border-white/10 text-white' : 'bg-white/96 border-b border-[#DAD9C4] text-[#3F4040]'}`}>
        <div className="flex items-center gap-4">
          <button 
            id="btn-toggle-menu" 
            onClick={() => setSidebarAbierto(true)}
            className="p-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold cursor-pointer shadow-sm transition"
          >
            <span>☰</span>
            <span className="hidden sm:inline">Menú Módulos</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-poppins font-bold text-xl tracking-wide">Sa·zón</span>
            <span className="text-[10px] font-mono-tag bg-[#7FBA00]/20 text-[#7FBA00] px-2 py-0.5 rounded uppercase">NUTRESA DIGITAL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold font-poppins">Andrés Vélez H.</span>
            <span className="block text-[10px] font-mono-tag opacity-80">Chef Desarrollador</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#7FBA00] text-[#1B4332] flex items-center font-bold font-poppins justify-center shadow">
            AV
          </div>
        </div>
      </header>

      {/* MENÚ LATERAL (SIDEBAR) - Sin iconos antes de cada módulo, tal como lo pediste */}
      <div 
        id="sidebar-overlay" 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${sidebarAbierto ? '' : 'hidden opacity-0'}`}
        onClick={() => setSidebarAbierto(false)}
      />

      <aside id="sidebar" className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] z-50 bg-[#3D8E33] text-white p-6 shadow-2xl overflow-y-auto transition-transform duration-300 ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Cabecera del Sidebar */}
        <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7FBA00] text-[#1B4332] flex items-center justify-center font-bold text-sm">
              Sa
            </div>
            <div>
              <h3 className="font-poppins font-bold text-lg text-white leading-tight">Sa·zón</h3>
              <span className="text-[10px] font-mono-tag text-white/80 tracking-wider">ECOSISTEMA NUTRESA</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarAbierto(false)}
            className="text-white hover:text-gray-200 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* MÓDULOS DEL SISTEMA (Sin iconos previos)[cite: 16] */}
        <div className="space-y-1 font-inter text-sm">
          <span className="text-[11px] font-mono-tag text-white/70 uppercase tracking-wider block mb-3">MÓDULOS DEL SISTEMA</span>
          
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Dashboard Principal
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Mi Perfil
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Catálogo Nutresa
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Recetario y Contenido
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Despensa Virtual
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Nutrición y Perfiles
          </button>
          <button onClick={() => { setVistaActiva('calendario'); setSidebarAbierto(false); }} className="w-full text-left px-3 py-2.5 rounded-xl bg-white/25 font-bold transition shadow-inner text-white">
            Planificador y Lista
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Comunidad y Reseñas
          </button>
          <button onClick={() => setSidebarAbierto(false)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/20 transition font-medium text-white">
            Campañas y Puntos
          </button>
        </div>

        {/* Botón Cerrar Menú */}
        <div className="mt-8 pt-4 border-t border-white/20">
          <button 
            onClick={() => setSidebarAbierto(false)}
            className="w-full py-3 bg-white/15 border border-white/30 rounded-xl text-center text-xs font-mono-tag font-bold hover:bg-white/25 transition cursor-pointer shadow text-white"
          >
            ⊗ Cerrar Menú
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* Migas de Pan */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs font-mono-tag">
            <li className={`px-3 py-1 rounded-md ${modoOscuro ? 'bg-white/10 text-white' : 'bg-[#1B4332] text-[#F4F4E8]'}`}>Inicio</li>
            <span className="text-gray-400">/</span>
            <li className="bg-[#3D8E33] text-white px-3 py-1 rounded-md font-bold">Planificador de Menús y Lista de Mercado</li>
          </ol>
        </nav>

        {/* Pestañas de navegación del planificador */}
        <div className={`p-3 rounded-2xl mb-6 flex flex-wrap gap-2 shadow-md transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#215B33] text-white'}`}>
          <button 
            onClick={() => setVistaActiva('calendario')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tag transition cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'calendario' 
                ? 'bg-[#7FBA00] text-[#1B4332] font-bold shadow' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span>📅</span> Calendario Semanal
          </button>
          <button 
            onClick={() => setVistaActiva('cronograma')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tag transition cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'cronograma' 
                ? 'bg-[#7FBA00] text-[#1B4332] font-bold shadow' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span>🕒</span> Cronograma Diario
          </button>
          <button 
            onClick={() => setVistaActiva('balance')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tag transition cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'balance' 
                ? 'bg-[#7FBA00] text-[#1B4332] font-bold shadow' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span>❤️</span> Balance Nutricional
          </button>
          <button 
            onClick={() => setVistaActiva('plantillas')}
            className={`px-4 py-2 rounded-xl text-xs font-mono-tag transition cursor-pointer flex items-center gap-2 ${
              vistaActiva === 'plantillas' 
                ? 'bg-[#7FBA00] text-[#1B4332] font-bold shadow' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <span>📋</span> Plantillas & Menús
          </button>
        </div>

        {/* ================= VISTA 1: CALENDARIO SEMANAL ================= */}
        {vistaActiva === 'calendario' && (
          <div className="space-y-6">
            
            <div className={`p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
              <div>
                <span className="font-mono-tag text-xs text-[#66d149] uppercase tracking-wider">Semana Activa: Semana Principal</span>
                <h2 className="text-2xl md:text-3xl font-bold font-poppins mt-1">
                  Calendario Semanal de <span className="italic text-[#66d149]">Comidas</span>
                </h2>
                <p className="text-sm font-inter opacity-90 mt-1">Organiza tu alimentación de Lunes a Viernes por momento de comida.</p>
              </div>
              <button 
                onClick={handleVaciarSemana}
                className="bg-red-600/20 border border-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-xl text-xs font-mono-tag font-bold transition flex items-center gap-2 cursor-pointer"
              >
                🗑️ Vaciar Semana
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-2xl shadow transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
                <span className="text-xs text-gray-300 uppercase tracking-wider block font-mono-tag">Recetas Agendadas</span>
                <span className="text-3xl font-bold font-poppins text-[#66d149] mt-2 block">{recetasAgendadasCount}</span>
              </div>
              <div className={`p-5 rounded-2xl shadow transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
                <span className="text-xs text-gray-300 uppercase tracking-wider block font-mono-tag">Bloques Llenos</span>
                <span className="text-3xl font-bold font-poppins text-[#66d149] mt-2 block">{recetasAgendadasCount}/{totalBloques}</span>
              </div>
              <div className={`p-5 rounded-2xl shadow transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
                <span className="text-xs text-gray-300 uppercase tracking-wider block font-mono-tag">Cocina Total</span>
                <span className="text-3xl font-bold font-poppins text-[#66d149] mt-2 block">25 min</span>
              </div>
            </div>

            {/* Formulario Asignar */}
            <form onSubmit={handleAsignarReceta} className={`p-5 rounded-2xl flex flex-wrap gap-4 items-end shadow-lg transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
              <div>
                <label className="block text-xs font-mono-tag text-gray-300 mb-1">Día:</label>
                <select 
                  value={seleccionActual.dia}
                  onChange={(e) => setSeleccionActual({ ...seleccionActual, dia: e.target.value })}
                  className="bg-black/20 border border-white/20 text-white rounded-lg p-2 text-xs font-mono-tag focus:outline-none focus:border-[#66d149]"
                >
                  {DIAS.map(d => <option key={d} value={d} className="bg-[#1B4332]">{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tag text-gray-300 mb-1">Momento:</label>
                <select 
                  value={seleccionActual.momento}
                  onChange={(e) => setSeleccionActual({ ...seleccionActual, momento: e.target.value })}
                  className="bg-black/20 border border-white/20 text-white rounded-lg p-2 text-xs font-mono-tag focus:outline-none focus:border-[#66d149]"
                >
                  {MOMENTOS.map(m => <option key={m.id} value={m.id} className="bg-[#1B4332]">{m.label}</option>)}
                </select>
              </div>

              <div className="flex-1 min-w-[220px]">
                <label className="block text-xs font-mono-tag text-gray-300 mb-1">Nombre de la Receta:</label>
                <input 
                  type="text"
                  value={recetaInput}
                  onChange={(e) => setRecetaInput(e.target.value)}
                  placeholder="Ej. Ensalada César, Bandeja Paisa..."
                  className="bg-black/20 border border-white/20 text-white rounded-lg p-2 text-xs font-mono-tag w-full focus:outline-none focus:border-[#66d149] placeholder-gray-300"
                />
              </div>

              <button 
                type="submit"
                className="bg-[#7FBA00] text-[#1B4332] font-mono-tag font-bold px-5 py-2 rounded-lg text-xs hover:bg-[#66d149] transition cursor-pointer shadow"
              >
                + Asignar Receta
              </button>
            </form>

            {/* Matriz de Días y Buscador */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {DIAS.map(dia => (
                  <div key={dia} className={`rounded-2xl border flex flex-col overflow-hidden shadow transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border-[#215B33]' : 'bg-[#1B4332] text-white border-[#215B33]'}`}>
                    <div className="bg-black/20 p-3 font-bold text-center border-b border-white/10 font-poppins text-sm">
                      {dia}
                    </div>
                    <div className="p-3 flex-1 flex flex-col gap-3">
                      {MOMENTOS.map(momento => {
                        const clave = `${dia}-${momento.id}`;
                        const recetaAsignada = calendario[clave];

                        return (
                          <div key={momento.id} className="border border-dashed border-white/20 rounded-xl p-2 bg-black/10 flex flex-col justify-between min-h-[90px]">
                            <span className="font-mono-tag text-[10px] font-semibold text-[#66d149] uppercase block mb-1">
                              {momento.label}
                            </span>
                            {recetaAsignada ? (
                              <div className="flex justify-between items-start bg-black/30 p-2 rounded-lg shadow-sm border border-white/10">
                                <span className="text-xs font-inter text-white font-medium line-clamp-2">{recetaAsignada}</span>
                                <button 
                                  type="button"
                                  onClick={() => handleEliminarReceta(dia, momento.id)}
                                  className="text-red-400 hover:text-red-300 text-xs font-bold ml-1 cursor-pointer shrink-0 font-mono-tag"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => setSeleccionActual({ dia, momento: momento.id })}
                                className="text-center my-auto cursor-pointer group"
                              >
                                <span className="text-[11px] font-mono-tag text-gray-300 group-hover:text-[#66d149] italic block">+ Agregar</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel Buscador de Recetas (Insensible a mayúsculas/minúsculas) */}
              <div className={`p-4 rounded-2xl border flex flex-col gap-4 shadow h-fit transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border-[#215B33]' : 'bg-[#1B4332] text-white border-[#215B33]'}`}>
                <h3 className="font-poppins font-bold text-base">Recetas Disponibles</h3>
                <p className="text-xs font-inter text-gray-300">Escribe una inicial (mayúscula o minúscula) para buscar:</p>
                <input 
                  type="text" 
                  value={filtroReceta}
                  onChange={(e) => setFiltroReceta(e.target.value)}
                  placeholder="Filtrar recetas..."
                  className="bg-black/20 border border-white/20 rounded-lg p-2 text-xs font-mono-tag text-white placeholder-gray-300 focus:outline-none focus:border-[#66d149]"
                />
                <div className="space-y-2 mt-2">
                  {recetasFiltradas.length > 0 ? (
                    recetasFiltradas.map((receta, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setRecetaInput(receta)}
                        className="p-2 bg-black/20 rounded-lg border border-white/10 text-xs font-inter text-white hover:border-[#66d149] cursor-pointer transition"
                      >
                        🍜 {receta}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-inter text-gray-300 italic">No se encontraron recetas.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= VISTA 2: CRONOGRAMA DIARIO ================= */}
        {vistaActiva === 'cronograma' && (
          <div className={`space-y-6 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono-tag text-xs text-[#66d149] uppercase">Vista de Enfoque</span>
                <h2 className="text-2xl font-bold font-poppins mt-1">
                  Cronograma & Detalle del <span className="italic text-[#66d149]">Día</span>
                </h2>
                <p className="text-sm font-inter text-gray-300">Visualiza las preparaciones continuas del día seleccionado.</p>
              </div>
              
              <select 
                value={diaCronograma}
                onChange={(e) => setDiaCronograma(e.target.value)}
                className="bg-black/20 border border-white/20 text-white rounded-xl p-2 text-xs font-mono-tag focus:outline-none focus:border-[#66d149]"
              >
                {DIAS.map(d => <option key={d} value={d} className="bg-[#1B4332]">{d}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              {MOMENTOS.map(momento => {
                const clave = `${diaCronograma}-${momento.id}`;
                const receta = calendario[clave];

                return (
                  <div key={momento.id} className="bg-black/20 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#7FBA00] text-[#1B4332] px-3 py-1 rounded-lg text-xs font-bold font-mono-tag">
                        {momento.label}
                      </span>
                      <span className={`text-sm font-inter ${receta ? 'text-white font-medium' : 'text-gray-300 italic'}`}>
                        {receta || 'Sin receta agendada'}
                      </span>
                    </div>
                    {receta && (
                      <button 
                        onClick={() => handleEliminarReceta(diaCronograma, momento.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer font-mono-tag"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VISTA 3: BALANCE NUTRICIONAL ================= */}
        {vistaActiva === 'balance' && (
          <div className={`space-y-6 p-6 rounded-2xl shadow-lg transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
            <div>
              <span className="font-mono-tag text-xs text-[#66d149] uppercase">Análisis Semanal</span>
              <h2 className="text-2xl font-bold font-poppins mt-1">
                Balance <span className="italic text-[#66d149]">Nutricional</span>
              </h2>
              <p className="text-sm font-inter text-gray-300">Medición estimada de balance energético y macronutrientes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-6 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300 uppercase font-mono-tag">Calorías Totales Estimadas</span>
                <span className="text-4xl font-bold font-poppins text-[#66d149] mt-2 block">450 kcal</span>
                <span className="text-xs font-inter text-gray-300 mt-2 block">Promedio diario: 90 kcal/día</span>
              </div>

              <div className="bg-black/20 p-6 rounded-xl border border-white/10 space-y-4">
                <span className="text-xs text-gray-300 uppercase font-mono-tag">Distribución Macronutricional</span>
                <div>
                  <span className="text-xs font-inter text-white block mb-1">Proteína (Zenú / Pietrán)</span>
                  <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-[#7FBA00] h-full w-[65%]"></div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-inter text-white block mb-1">Carbohidratos (Pastas Doria / Noel)</span>
                  <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-[#66d149] h-full w-[40%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VISTA 4: PLANTILLAS & MENÚS ================= */}
        {vistaActiva === 'plantillas' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl shadow-lg space-y-4 transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
              <div>
                <span className="font-mono-tag text-xs text-[#66d149] uppercase">Gestión de Menús</span>
                <h2 className="text-2xl font-bold font-poppins mt-1">
                  Historial de Planes Semanales & <span className="italic text-[#66d149]">Plantillas</span>
                </h2>
                <p className="text-sm font-inter text-gray-300">Busca un plan por ID o cárgalo directamente como semana activa.</p>
              </div>

              <div className="flex gap-3">
                <input 
                  type="text"
                  value={busquedaPlan}
                  onChange={(e) => setBusquedaPlan(e.target.value)}
                  placeholder="Ej. semana-principal o semana-fitness-01"
                  className="bg-black/20 border border-white/20 rounded-xl p-3 text-xs font-mono-tag text-white flex-1 placeholder-gray-300 focus:outline-none focus:border-[#66d149]"
                />
                <button 
                  onClick={() => mostrarToast(`Buscando plan: ${busquedaPlan}`)}
                  className="bg-[#7FBA00] text-[#1B4332] font-mono-tag font-bold px-6 py-3 rounded-xl text-xs hover:bg-[#66d149] transition cursor-pointer"
                >
                  🔍 Buscar Plan
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg space-y-4 transition-colors duration-300 ${modoOscuro ? 'bg-[#133326] border border-[#215B33]' : 'bg-[#1B4332] text-white'}`}>
              <h3 className="font-poppins font-bold text-lg">Historial de Planes Semanales Creados</h3>
              <p className="text-xs font-inter text-gray-300">Lista de tus planes personalizados en el sistema.</p>

              <div className="space-y-3">
                {planesGuardados.map(plan => (
                  <div key={plan.id} className="bg-black/20 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold font-poppins">{plan.nombre}</h4>
                      <span className="text-xs text-gray-300 font-mono-tag">ID: {plan.id}</span>
                    </div>
                    {plan.activo ? (
                      <span className="text-xs font-mono-tag font-bold text-[#66d149] bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                        Activo (En uso)
                      </span>
                    ) : (
                      <button 
                        onClick={() => {
                          setPlanesGuardados(planesGuardados.map(p => ({
                            ...p,
                            activo: p.id === plan.id
                          })));
                          mostrarToast(`Plan ${plan.nombre} cargado`);
                        }}
                        className="bg-[#7FBA00] text-[#1B4332] px-4 py-2 rounded-lg text-xs font-mono-tag font-bold hover:bg-[#66d149] transition cursor-pointer"
                      >
                        ↓ Cargar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* STICKY FOOTER (Cacao en Día / Marfil en Noche)[cite: 7, 8] */}
      <footer className={`mt-auto py-6 px-6 text-center text-xs font-inter transition-colors duration-300 ${modoOscuro ? 'bg-[#F4F4E8] text-[#3F4040]' : 'bg-[#643B22] text-[#F4F4E8]'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-poppins font-bold">Sa·zón · Nutresa Digital</p>
          <p className="opacity-90">Cocina con lo que tienes en casa</p>
          <span className="font-mono-tag opacity-80">Sistema de Gestión de Recetas v1.0</span>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE MODO DÍA / NOCHE[cite: 8, 10] */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#133326] dark:bg-black/85 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-1">
        <button 
          onClick={() => cambiarTema(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tag font-bold transition cursor-pointer ${
            !modoOscuro 
              ? 'bg-[#7FBA00] text-[#1B4332] shadow' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <span>☀️</span> Día
        </button>

        <button 
          onClick={() => cambiarTema(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tag font-bold transition cursor-pointer ${
            modoOscuro 
              ? 'bg-[#7FBA00] text-[#1B4332] shadow' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <span>🌙</span> Noche
        </button>
      </div>

    </div>
  );
}