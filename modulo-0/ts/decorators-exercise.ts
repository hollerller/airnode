const readSensor = () => {
  console.log("Leyendo BME680...");
};

const logExecution = (func: () => void): (() => void) => {
  return () => {
    console.log("[LOG] Ejecutando: " + func.name);
    func();
    console.log("[LOG] Finalizado: " + func.name);
  };
};

const logReading = logExecution(readSensor);
logReading();
