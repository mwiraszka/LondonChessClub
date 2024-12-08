/**
 * @returns {string} The new peak rating
 */
export function getNewPeakRating(rating?: string, peakRating?: string): string {
  if (!rating || !peakRating) {
    return '';
  }

  if (!peakRating) {
    return rating;
  }

  const ratingNum = +rating.split('/')[0];
  const peakRatingNum = +peakRating.split('/')[0];

  const surpassedCurrentPeakRating = ratingNum > peakRatingNum;
  const firstNonProvisionalRating = !rating.includes('/') && peakRating.includes('/');

  return surpassedCurrentPeakRating || firstNonProvisionalRating ? rating : peakRating;
}
