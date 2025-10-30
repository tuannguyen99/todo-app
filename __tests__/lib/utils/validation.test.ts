import { isValidTodoText, TODO_CONSTRAINTS } from '@/lib/utils/validation';

describe('validation utilities', () => {
  describe('TODO_CONSTRAINTS', () => {
    it('should have correct MIN_TEXT_LENGTH', () => {
      expect(TODO_CONSTRAINTS.MIN_TEXT_LENGTH).toBe(1);
    });

    it('should have correct MAX_TEXT_LENGTH', () => {
      expect(TODO_CONSTRAINTS.MAX_TEXT_LENGTH).toBe(500);
    });

    it('should have correct STORAGE_KEY', () => {
      expect(TODO_CONSTRAINTS.STORAGE_KEY).toBe('todos');
    });
  });

  describe('isValidTodoText', () => {
    it('should return true for valid text', () => {
      expect(isValidTodoText('Buy milk')).toBe(true);
      expect(isValidTodoText('A')).toBe(true);
      expect(isValidTodoText('  Valid text with spaces  ')).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidTodoText('')).toBe(false);
    });

    it('should return false for whitespace-only string', () => {
      expect(isValidTodoText('   ')).toBe(false);
      expect(isValidTodoText('\t\n')).toBe(false);
    });

    it('should return true for 500 character text', () => {
      const text500 = 'a'.repeat(500);
      expect(isValidTodoText(text500)).toBe(true);
    });

    it('should return false for 501 character text', () => {
      const text501 = 'a'.repeat(501);
      expect(isValidTodoText(text501)).toBe(false);
    });

    it('should handle text with leading/trailing whitespace correctly', () => {
      const text = '   ' + 'a'.repeat(500) + '   ';
      expect(isValidTodoText(text)).toBe(true);
    });

    it('should return false when trimmed text exceeds 500 characters', () => {
      const text = '  ' + 'a'.repeat(501) + '  ';
      expect(isValidTodoText(text)).toBe(false);
    });
  });
});
