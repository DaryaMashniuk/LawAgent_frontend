export const AUTH_TOKEN = 'auth_token'
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
export const DOCUMENT_CATEGORIES = {
    STATE_BODIES : "Государственные органы",
    PROGRAM_ACTS:"Акты программного характера",
    ADMIN_PROCEDURES:"Административные процедуры",
    BUSINESS:"Бизнес",
    COURT_PRACTICE:"Cудебная практика",
    OTHER : "Другие"
  }