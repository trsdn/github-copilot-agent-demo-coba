const { test, expect } = require('@playwright/test');

test.describe('Calculator App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator app
    await page.goto('file://' + __dirname.replace('/tests', '') + '/index.html');
  });

  test('should display initial state correctly', async ({ page }) => {
    // Check if calculator loads with initial display
    await expect(page.locator('#current-operand')).toHaveText('0');
    await expect(page.locator('#previous-operand')).toHaveText('');
  });

  test('should handle basic number input', async ({ page }) => {
    // Click number buttons
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("2")');
    await page.click('[data-number]:has-text("3")');
    
    await expect(page.locator('#current-operand')).toHaveText('123');
  });

  test('should perform basic addition', async ({ page }) => {
    // Test: 5 + 3 = 8
    await page.click('[data-number]:has-text("5")');
    await page.click('[data-operator]:has-text("+")');
    await page.click('[data-number]:has-text("3")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('8');
  });

  test('should perform basic subtraction', async ({ page }) => {
    // Test: 10 - 4 = 6
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("0")');
    await page.click('[data-operator]:has-text("-")');
    await page.click('[data-number]:has-text("4")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('6');
  });

  test('should perform basic multiplication', async ({ page }) => {
    // Test: 6 × 7 = 42
    await page.click('[data-number]:has-text("6")');
    await page.click('[data-operator]:has-text("×")');
    await page.click('[data-number]:has-text("7")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('42');
  });

  test('should perform basic division', async ({ page }) => {
    // Test: 15 ÷ 3 = 5
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("5")');
    await page.click('[data-operator]:has-text("÷")');
    await page.click('[data-number]:has-text("3")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('5');
  });

  test('should handle decimal numbers', async ({ page }) => {
    // Test: 3.14 + 2.86 = 6
    await page.click('[data-number]:has-text("3")');
    await page.click('[data-number]:has-text(".")');
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("4")');
    await page.click('[data-operator]:has-text("+")');
    await page.click('[data-number]:has-text("2")');
    await page.click('[data-number]:has-text(".")');
    await page.click('[data-number]:has-text("8")');
    await page.click('[data-number]:has-text("6")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('6');
  });

  test('should clear display when Clear button is clicked', async ({ page }) => {
    // Enter some numbers
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("2")');
    await page.click('[data-number]:has-text("3")');
    
    // Click clear
    await page.click('[data-clear]');
    
    await expect(page.locator('#current-operand')).toHaveText('0');
    await expect(page.locator('#previous-operand')).toHaveText('');
  });

  test('should delete last digit when delete button is clicked', async ({ page }) => {
    // Enter some numbers
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text("2")');
    await page.click('[data-number]:has-text("3")');
    
    // Delete last digit
    await page.click('[data-delete]');
    
    await expect(page.locator('#current-operand')).toHaveText('12');
  });

  test('should handle keyboard input', async ({ page }) => {
    // Test keyboard number input
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    
    await expect(page.locator('#current-operand')).toHaveText('123');
    
    // Test keyboard operators
    await page.keyboard.press('+');
    await page.keyboard.press('4');
    await page.keyboard.press('5');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('#current-operand')).toHaveText('168');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Enter numbers
    await page.keyboard.press('5');
    await page.keyboard.press('0');
    
    // Test Escape for clear
    await page.keyboard.press('Escape');
    await expect(page.locator('#current-operand')).toHaveText('0');
    
    // Enter numbers again
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    
    // Test Backspace for delete
    await page.keyboard.press('Backspace');
    await expect(page.locator('#current-operand')).toHaveText('12');
  });

  test('should prevent multiple decimal points', async ({ page }) => {
    // Try to add multiple decimal points
    await page.click('[data-number]:has-text("3")');
    await page.click('[data-number]:has-text(".")');
    await page.click('[data-number]:has-text("1")');
    await page.click('[data-number]:has-text(".")'); // This should be ignored
    await page.click('[data-number]:has-text("4")');
    
    await expect(page.locator('#current-operand')).toHaveText('3.14');
  });

  test('should handle chain calculations', async ({ page }) => {
    // Test: 2 + 3 × 4 (should be 5 × 4 = 20, not 2 + 12 = 14)
    await page.click('[data-number]:has-text("2")');
    await page.click('[data-operator]:has-text("+")');
    await page.click('[data-number]:has-text("3")');
    await page.click('[data-operator]:has-text("×")'); // This should compute 2+3=5 first
    await page.click('[data-number]:has-text("4")');
    await page.click('[data-equals]');
    
    await expect(page.locator('#current-operand')).toHaveText('20');
  });

  test('should display operation in previous operand', async ({ page }) => {
    // Enter calculation
    await page.click('[data-number]:has-text("5")');
    await page.click('[data-operator]:has-text("+")');
    
    // Check previous operand shows the operation
    await expect(page.locator('#previous-operand')).toHaveText('5 +');
    
    await page.click('[data-number]:has-text("3")');
    await expect(page.locator('#current-operand')).toHaveText('3');
  });

  test('should handle division by zero', async ({ page }) => {
    // Setup page dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Cannot divide by zero!');
      await dialog.accept();
    });
    
    // Test division by zero
    await page.click('[data-number]:has-text("5")');
    await page.click('[data-operator]:has-text("÷")');
    await page.click('[data-number]:has-text("0")');
    await page.click('[data-equals]');
    
    // The display should remain unchanged after the alert
    await expect(page.locator('#current-operand')).toHaveText('0');
  });

  test('should handle large numbers with formatting', async ({ page }) => {
    // Create a large number: 1000000
    await page.click('[data-number]:has-text("1")');
    for (let i = 0; i < 6; i++) {
      await page.click('[data-number]:has-text("0")');
    }
    
    // Should format with commas
    await expect(page.locator('#current-operand')).toHaveText('1,000,000');
  });

  test('should have proper button hover effects', async ({ page }) => {
    const button = page.locator('[data-number]:has-text("5")');
    
    // Check button is visible
    await expect(button).toBeVisible();
    
    // Hover over button
    await button.hover();
    
    // Check that hover effect is applied (button should have transform)
    const transform = await button.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Transform should not be 'none' when hovered
    expect(transform).not.toBe('none');
  });
});
