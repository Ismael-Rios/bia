const { formatDate } = require('../scripts/formatDate');

describe('formatDate', () => {

  it('should format the date correctly for a typical date like March 15, 2023, at 14:30:45', () => {
      const date = new Date(2023, 2, 15, 14, 30, 45); // March is month 2 in JavaScript Date
      const formattedDate = formatDate(date);
      expect(formattedDate).toBe('15/03/2023 14:30:45');
  });
});
