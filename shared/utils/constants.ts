export const CRON_SCHEDULES_PRESET = Object.freeze({
  EVERY_DAY: '0 0 * * *', // At 00:00 (midnight) every day
  EVERY_HOUR: '0 * * * *', // At the start of every hour
  EVERY_15_MINUTES: '*/15 * * * *', // Every 15 minutes
  EVERY_5_MINUTES: '*/5 * * * *', // Every 5 minutes
  EVERY_MINUTE: '* * * * *', // Every minute

  // Month
  FIRST_DAY_OF_MONTH: '0 0 1 * *', // At 00:00 on day 1 of the month

  // Week
  EVERY_MONDAY: '0 0 * * 1', // At 00:00 every Monday

  // Year
  FIRST_DAY_OF_YEAR: '0 0 1 1 *', // At 00:00 on January 1st

  // Quarter
  FIRST_DAY_OF_QUARTER: '0 0 1 1,4,7,10 *', // At 00:00 on day 1 of Jan, Apr, Jul, Oct
})
