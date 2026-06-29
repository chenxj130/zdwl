/**
 * 密码哈希工具函数
 * 使用浏览器原生 Web Crypto API 实现 SHA-256 哈希，无需第三方库依赖
 */

const STORAGE_KEY = "admin_password_hash";

/**
 * 将明文密码转换为 SHA-256 十六进制哈希字符串
 * @param plain 明文密码
 * @returns SHA-256 哈希字符串
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 验证明文密码是否与存储的哈希值匹配
 * @param plain 用户输入的明文密码
 * @param storedHash 已存储的 SHA-256 哈希
 * @returns 是否匹配
 */
export async function verifyPassword(
  plain: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await hashPassword(plain);
  return inputHash === storedHash;
}

/**
 * 获取 LocalStorage 中已保存的密码哈希
 * @returns 密码哈希字符串，未设置时返回 null
 */
export function getStoredPasswordHash(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * 将密码哈希保存到 LocalStorage
 * @param hash SHA-256 哈希字符串
 */
export function savePasswordHash(hash: string): void {
  localStorage.setItem(STORAGE_KEY, hash);
}

/**
 * 清除已保存的自定义密码哈希（恢复为默认密码 admin）
 */
export function clearPasswordHash(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** 默认管理员密码 */
export const DEFAULT_PASSWORD = "admin";
