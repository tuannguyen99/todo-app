// __tests__/sample.test.ts
describe('Jest Configuration', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should have access to jest-dom matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
    document.body.removeChild(element);
  });
});
