export class DateUtils {
  public static dateDifferenceToSeconds(start: Date, end: Date) {
    const sec_dif = end.getTime() - start.getTime();
    const secondsDiff = sec_dif / 1000;
    const dayDiff = this.countDaysDifference(start, end);
    return secondsDiff ;
  }

  public static countDaysDifference(start: Date, end: Date) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs(((start as any) - (end as any)) / oneDay)
    );
    return diffDays;
  }
}
