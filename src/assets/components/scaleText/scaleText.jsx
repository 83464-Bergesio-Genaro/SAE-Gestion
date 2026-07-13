import { SAETypography } from "../typography/SAETypography";
export function ScaleText({ text, maxWidth, maxHeight, minFontSize = "8px", maxFontSize = "20px" }) {
  if (!text) return null;

  // La fórmula mágica depende de tu fuente, pero esta es una base sólida:
  // Ancho aproximado de un carácter ≈ fontSize * 0.6 (para fuentes estándar)
  
  let calculatedSize = maxFontSize;

  // Iteración simple para encontrar el tamaño que cabe (sin medir DOM, solo matemática)
  // Probamos desde el tamaño máximo hacia abajo hasta que la estimación quepa
  for (let size = maxFontSize; size >= minFontSize; size -= 0.5) {
    // Estimación de ancho: caracteres * factor de ancho medio (0.6 es estándar para sans-serif)
    // Si tu fuente es monoespaciada, usa 1.0. Si es muy estrecha, usa 0.5.
    const estimatedWidth = text.length * size * 0.6; 
    const estimatedHeight = size * 1.2; // Line-height aprox

    if (estimatedWidth <= maxWidth && estimatedHeight <= maxHeight) {
      calculatedSize = size;
      break; // Encontramos el tamaño más grande que cabe
    }
  }
  return (
    <SAETypography 
    variant="body2"
    sx={{ 
      fontSize: `${calculatedSize}px`, 
      lineHeight: 1,
      width: '100%',
      height: '100%'
    }}>
      {text}
    </SAETypography>
  );
}