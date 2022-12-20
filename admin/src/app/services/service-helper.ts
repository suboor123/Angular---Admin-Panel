import { echo } from '@core/lib/echo';

export const handleError = (error: Error) => {
  echo('Error', [JSON.stringify(error)]);
};
