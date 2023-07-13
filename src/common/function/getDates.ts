import moment from 'moment';

import IDateInfo from '../interface/date-info.interface';

export default function getDates(): IDateInfo {
  const date = new Date();
  const result = moment.utc(date);
  return {
    startOrFinishTime: result.toDate(),
    checkInByDay: result.format('YYYY-MM-DD'),
    time: result.format('HH:mm:ss'),
  };
}
