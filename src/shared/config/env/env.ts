/**
 * @types
 */
type AppEnv = {
  apiBaseUrl: string;
};

export function readEnv(): AppEnv {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof apiBaseUrl !== "string" || apiBaseUrl.length === 0) {
    throw new Error("VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
  }
  return { apiBaseUrl };
}
