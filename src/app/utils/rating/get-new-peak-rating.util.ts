/**
 * Return new peak Elo rating based on current rating and current peak rating.
 */
export function getNewPeakRating(rating?: string, peakRating?: string): string {
  if (!rating || !peakRating) {
    return '';
  }

  const ratingNum = Number(rating.split('/')[0]);
  const peakRatingNum = Number(peakRating.split('/')[0]);

  const surpassedCurrentPeakRating = ratingNum > peakRatingNum;
  const firstNonProvisionalRating = !rating.includes('/') && peakRating.includes('/');

  return surpassedCurrentPeakRating || firstNonProvisionalRating ? rating : peakRating;
}
