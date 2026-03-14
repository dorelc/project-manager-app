export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Lipsește variabila de mediu ${name}. Verifică fișierul .env.local sau variabilele din Vercel.`);
  }

  return value;
}
