interface TimelineProps {
  selectedYearRange: [number, number];
  setSelectedYearRange: (range: [number, number]) => void;
  minYear: number;
  maxYear: number;
  dateFormat: 'AC/DC' | 'BCE/CE';
}

export function Timeline({ selectedYearRange, setSelectedYearRange, minYear, maxYear, dateFormat }: TimelineProps) {
  const formatYear = (year: number) => {
    if (year < 0) {
      return `${Math.abs(year)} ${dateFormat === 'AC/DC' ? 'a.C.' : 'BCE'}`;
    }
    return `${year} ${dateFormat === 'AC/DC' ? 'd.C.' : 'CE'}`;
  };

  // Funciones para transformación logarítmica
  const toLogarithmic = (year: number): number => {
    // Ajustamos para manejar años negativos y positivos
    const sign = year >= 0 ? 1 : -1;
    const absYear = Math.abs(year);
    
    // Usamos logaritmo para comprimir los años antiguos y expandir los recientes
    // Añadimos 1 para evitar log(0)
    return sign * Math.log(absYear + 1) / Math.log(Math.abs(maxYear) + 1) * Math.abs(maxYear);
  };

  const fromLogarithmic = (logValue: number): number => {
    // Convertimos de valor logarítmico a año real
    const sign = logValue >= 0 ? 1 : -1;
    const absLogValue = Math.abs(logValue);
    
    // Transformación inversa
    const year = Math.round(Math.exp(absLogValue * Math.log(Math.abs(maxYear) + 1) / Math.abs(maxYear)) - 1);
    return sign * year;
  };

  // Convertimos los valores del rango a escala logarítmica para visualización
  const logMinYear = toLogarithmic(minYear);
  const logMaxYear = toLogarithmic(maxYear);
  const logSelectedStart = toLogarithmic(selectedYearRange[0]);
  const logSelectedEnd = toLogarithmic(selectedYearRange[1]);

  const handleRangeChange = (logValue: number, isStart: boolean) => {
    // Convertimos el valor logarítmico de vuelta a año real
    const realYear = fromLogarithmic(logValue);
    
    if (isStart) {
      if (realYear <= selectedYearRange[1]) {
        setSelectedYearRange([realYear, selectedYearRange[1]]);
      }
    } else {
      if (realYear >= selectedYearRange[0]) {
        setSelectedYearRange([selectedYearRange[0], realYear]);
      }
    }
  };

  return (
    
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 max-w-3xl bg-[url(/fondo-inverted.png)] backdrop-blur-md rounded-lg ">
      <div className="flex flex-col gap-4 dark:bg-black bg-black/80 backdrop-blur-sm rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <span className="text-sm">{formatYear(minYear)}</span>
          <span className="text-lg font-bold">
            Rango: {formatYear(selectedYearRange[0])} - {formatYear(selectedYearRange[1])}
          </span>
          <span className="text-sm">{formatYear(maxYear)}</span>
        </div>
        <div className="flex gap-4">
          <div className="relative w-full">
            <div 
              className="absolute top-1 -translate-y-1/2 h-2 bg-white/30 rounded-lg"
              style={{
                left: `${((logSelectedStart - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                right: `${100 - ((logSelectedEnd - logMinYear) / (logMaxYear - logMinYear)) * 100}%`
              }}
            />
            <input
              type="range"
              min={logMinYear}
              max={logMaxYear}
              value={logSelectedStart}
              onChange={(e) => handleRangeChange(Number(e.target.value), true)}
              className="absolute w-full h-2  bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 
              [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/90 dark:[&::-webkit-slider-thumb]:bg-white/90 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-black/70
              [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black/90 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-black/70"
              step="1"
            />
          </div>
          <div className="relative w-full">
            <div 
              className="absolute top-1 -translate-y-1/2 h-2 bg-white/30 rounded-lg"
              style={{
                left: `${((logSelectedStart - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                right: `${100 - ((logSelectedEnd - logMinYear) / (logMaxYear - logMinYear)) * 100}%`
              }}
            />
            <input
              type="range"
              min={logMinYear}
              max={logMaxYear}
              value={logSelectedEnd}
              onChange={(e) => handleRangeChange(Number(e.target.value), false)}
              className="absolute w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20
              [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/90 dark:[&::-webkit-slider-thumb]:bg-white/90 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-black/70
              [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black/90 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-black/70"
              step="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}