import { Time } from '../../models/time';

export default async function getCurrentDate(roomId: object): Promise<object> {
  const timeLine = await Time.findOne({ room: roomId });
  const currentArrDate = timeLine.dates;
  const result = currentArrDate.find((dateRange) => {
    const startDate = dateRange[0];
    return new Date(startDate).toDateString() === new Date().toDateString();
  });

  return result;
}
