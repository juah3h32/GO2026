// Importamos los archivos individuales
// NOTA: Asegúrate de usar llaves { } porque en tus archivos usaste 'export const'
import { es } from './es';
import { en } from './en';
import { pt } from './pt';
import { zh } from './zh'; // <--- AQUÍ suele estar el error si faltan las llaves
import { ar } from './ar';

// Definimos los nombres de los idiomas
export const languages = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  zh: '中文',
  ar: 'العربية'
};

// Juntamos todas las traducciones en un solo objeto
export const translations = {
  es,
  en,
  pt,
  zh, // <--- Si el import de arriba falla, esto da error
  ar
};