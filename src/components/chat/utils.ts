export function generateRandomNickname(): string {
  const adjectives = ['멋진', '귀여운', '똑똑한', '용감한', '빠른', '차분한', '활발한', '친절한', '밝은', '조용한', '행복한', '긍정적인', '창의적인', '유쾌한', '신비로운'];
  const nouns = ['토끼', '고양이', '강아지', '펭귄', '곰', '사자', '호랑이', '여우', '늑대', '사슴', '다람쥐', '햄스터', '펜더', '코알라', '판다'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999) + 1;
  return adjective + noun + number;
}

export function formatTime(timestamp: string): string {
  const time = new Date(timestamp);
  return time.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
