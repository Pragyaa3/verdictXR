// Mock AI agent for judge/lawyer/jury roles
export type Role = 'judge' | 'lawyer' | 'jury';

export function getAIResponse(role: Role, message: string): string {
  switch (role) {
    case 'judge':
      return `Judge: After considering the arguments, my preliminary view is...`;
    case 'lawyer':
      return `Lawyer: Based on the evidence, I argue that...`;
    case 'jury':
      return `Jury: We are deliberating and will return a verdict soon.`;
    default:
      return `Unknown role.`;
  }
} 