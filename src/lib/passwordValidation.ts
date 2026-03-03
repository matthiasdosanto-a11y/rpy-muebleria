// lib/passwordValidation.ts

// Definir el tipo primero
export type PasswordValidationResult = {
  isValid: boolean;
  score: number;
  message: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
};

// Lista negra de contraseñas comunes
export const commonPasswords: string[] = [
  '123456', 'password', '123456789', '12345678', '12345',
  '1234567', 'password1', '1234567890', '123123', 'qwerty',
  'abc123', '111111', 'iloveyou', 'admin', 'welcome',
  'monkey', 'dragon', 'master', 'sunshine', 'shadow',
  'baseball', 'football', 'letmein', '696969', 'mustang',
  'access', 'master', 'michael', 'superman', '123321',
  'qwertyuiop', '654321', 'jordan', 'harley', 'ranger',
  'jennifer', 'thunder', 'hunter', 'buster', 'soccer',
  'tigger', 'sunshine', 'iloveyou', '2000', 'charlie',
  'robert', 'thomas', 'hockey', 'ranger', 'daniel',
  'starwars', 'klaster', '112233', 'george', 'computer',
  'michelle', 'jessica', 'pepper', '1111', 'zxcvbn',
  '555555', '11111111', '131313', 'freedom', '777777',
  'pass', 'maggie', '159753', 'aaaaaa', 'ginger',
  'princess', 'joshua', 'cheese', 'amanda', 'summer',
  'love', 'ashley', 'nicole', 'chelsea', 'biteme',
  'matthew', 'access', 'yankees', '987654321', 'dallas',
  'austin', 'thunder', 'taylor', 'matrix', 'mobilemail',
  'mom', 'monitor', 'monitoring', 'montana', 'moon',
  'moscow', 'admin', 'user', 'root'
];

// Función para validar la fortaleza de la contraseña
export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  // Si la contraseña está vacía
  if (!password) {
    return {
      isValid: false,
      score: 0,
      message: 'La contraseña no puede estar vacía',
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        special: false
      }
    };
  }

  // Realizar verificaciones individuales
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  // Calcular puntuación (0-5)
  const score = Object.values(checks).filter(Boolean).length;

  // Determinar mensaje basado en la puntuación
  let message = '';
  if (score <= 2) {
    message = 'Contraseña débil. Usa al menos 8 caracteres, mayúsculas, números y símbolos.';
  } else if (score === 3) {
    message = 'Contraseña moderada. Puedes mejorarla añadiendo más variedad.';
  } else if (score === 4) {
    message = 'Contraseña fuerte. ¡Buen trabajo!';
  } else {
    message = 'Contraseña muy fuerte. ¡Excelente!';
  }

  // Una contraseña es válida si tiene al menos 3 de 5 criterios
  // y cumple con la longitud mínima
  const isValid = score >= 3 && password.length >= 8;

  return {
    isValid,
    score,
    message,
    checks // 👈 ESTO ES CRÍTICO - DEBE INCLUIRSE SIEMPRE
  };
};

// Función para verificar si es una contraseña común
export const isCommonPassword = (password: string): boolean => {
  return commonPasswords.includes(password.toLowerCase());
};

// Función para estimar el tiempo en romper la contraseña
export const estimateCrackTime = (password: string): string => {
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Calcular espacio de caracteres posibles
  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSpecial) charsetSize += 32; // Aproximadamente 32 caracteres especiales comunes
  
  if (charsetSize === 0) return 'instantáneo';
  
  // Calcular combinaciones posibles
  const combinations = Math.pow(charsetSize, length);
  
  // Asumiendo 10 mil millones de intentos por segundo (lo que puede hacer una máquina potente)
  const secondsToCrack = combinations / 10_000_000_000;
  
  if (secondsToCrack < 60) return 'menos de un minuto';
  if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutos`;
  if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} horas`;
  if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} días`;
  if (secondsToCrack < 315360000) return `${Math.round(secondsToCrack / 31536000)} años`;
  return 'siglos';
};

// Función para generar una contraseña segura aleatoria
export const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + special;
  let password = '';
  
  // Asegurar al menos uno de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Completar el resto aleatoriamente
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mezclar la contraseña
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};