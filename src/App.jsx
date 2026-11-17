import PlanSemanal from './planificador/PlanSemanal';

export default function App() {
  return (
    <div className="min-h-screen bg-sazon-marfil py-6 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-sazon-verdeNutresa font-poppins">
          Mi Recetario y Planificador Semanal
        </h1>
        <p className="text-sazon-texto2 text-sm mt-1">
          Organiza tus menús de la semana de forma rápida y sencilla
        </p>
      </header>
      <main>
        <PlanSemanal />
      </main>
    </div>
  );
}