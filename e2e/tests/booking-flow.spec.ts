import { test, expect } from '@playwright/test';

test.describe.serial('Full booking flow', () => {
  test('Step 1. Owner creates event-type', async ({ page }) => {
    await page.goto('/owner/event-types/new');
    
    await page.fill('#name', 'Тестовая консультация');
    await page.fill('#slug', 'test-consultation');
    await page.fill('#durationMinutes', '30');
    await page.fill('#description', 'Тестовое описание для E2E');
    
    await page.getByRole('button', { name: 'Создать' }).click();
    
    await page.waitForURL('/owner/event-types');
    await expect(page.getByText('Тестовая консультация')).toBeVisible();
  });

  test('Step 2. Owner sets availability', async ({ page }) => {
    await page.goto('/owner/availability');
    
    // Day of week in JS (0 is Sunday, 1 is Monday, etc)
    // The UI might use 0 for Monday or 0 for Sunday. Let's assume it has 7 rules.
    const dayOfWeek = new Date().getDay();
    // Assuming rules array indices map 0 to Sunday, 1 to Monday, etc, or 0 to Monday.
    // It's safer to just check all if possible, or assume 0 is Sunday, 1 is Monday...
    // The plan says: "Включение чекбокса для текущего дня недели (или понедельника-пятницы)"
    // Let's enable it for today. If backend uses Monday as 0, this might require some adjustment.
    // Let's just find the checkbox for today. Assuming standard JS getDay().
    // We can also just use getByRole('checkbox') and check the one we need.
    // Let's try `#rules.${dayOfWeek}.isAvailable` - wait, the plan explicitly gave `#rules.N.isAvailable`
    
    // To be safe, we'll try to find the index based on standard 1-7 or 0-6.
    // Or we can just check Monday to Friday to be sure.
    for (let i = 0; i < 7; i++) {
      const checkbox = page.locator(`#rules\\.${i}\\.isAvailable`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
        await page.fill(`#rules\\.${i}\\.startTime`, '09:00');
        await page.fill(`#rules\\.${i}\\.endTime`, '17:00');
      }
    }
    
    await page.getByRole('button', { name: 'Сохранить изменения' }).click();
    await expect(page.getByText('Расписание обновлено')).toBeVisible();
  });

  test('Step 3. Public user sees event-type', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.card', { hasText: 'Тестовая консультация' }).or(page.getByText('Тестовая консультация'));
    await expect(card.first()).toBeVisible();
    await page.getByRole('link', { name: 'Записаться' }).first().click();
    // Assuming clicking "Записаться" goes to /:slug
    await page.waitForURL('**/test-consultation');
  });

  test('Step 4. Public user selects slot and books', async ({ page }) => {
    await page.goto('/test-consultation');
    
    // Today's date is already selected by default, so we don't need to click it.
    
    // Wait for slots
    await page.waitForSelector('a:has-text(":")'); // Time slots have colon like "09:00"
    
    await page.getByRole('link', { name: /^\d{2}:\d{2}$/ }).first().click();
    
    await page.waitForURL('**/test-consultation/book?startTime=*');
    
    await page.fill('#guestName', 'Тест Гость');
    await page.fill('#guestEmail', 'guest@test.com');
    await page.fill('#guestComment', 'Тестовый комментарий');
    
    await page.getByRole('button', { name: 'Подтвердить' }).click();
    
    await expect(page.getByText('Бронирование успешно подтверждено!')).toBeVisible();
    await page.waitForURL('/');
  });

  test('Step 5. Owner sees booking in dashboard', async ({ page }) => {
    await page.goto('/owner');
    await expect(page.getByText('Тест Гость')).toBeVisible();
    await expect(page.getByText('guest@test.com')).toBeVisible();
  });

  test('Step 6. Owner cancels booking', async ({ page }) => {
    await page.goto('/owner');
    
    page.once('dialog', dialog => dialog.accept());
    
    await page.getByRole('button', { name: 'Отменить' }).first().click();
    
    await expect(page.getByText('Бронирование успешно отменено')).toBeVisible();
    await expect(page.getByText('guest@test.com')).not.toBeVisible();
  });
});
