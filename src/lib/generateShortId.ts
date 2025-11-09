/**
 * 4자리 짧은 ID 생성 (영문 소문자 + 숫자)
 * 예: a1b2, x9z3, k4m7
 */
export function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * 고유한 short_id 생성 (충돌 체크 포함)
 * @param existingIds 이미 사용 중인 ID 목록
 * @param maxAttempts 최대 시도 횟수
 */
export function generateUniqueShortId(
  existingIds: Set<string>,
  maxAttempts = 100
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const id = generateShortId();
    if (!existingIds.has(id)) {
      return id;
    }
  }
  
  throw new Error('Failed to generate unique short ID after maximum attempts');
}

