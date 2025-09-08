export { isStorageSupported } from './browser/is-storage-supported.util';

export { getEcoOpeningCode } from './chess/get-eco-opening-code.util';
export { getLichessAnalysisUrl } from './chess/get-lichess-analysis-url.util';
export { getNewPeakRating } from './chess/get-new-peak-rating.util';
export { getOpeningTallies } from './chess/get-opening-tallies.util';
export { getPlayerName } from './chess/get-player-name.util';
export { getPlyCount } from './chess/get-ply-count.util';
export { getResultTallies } from './chess/get-result-tallies.util';
export { getScore } from './chess/get-score.util';

export { areSame } from './common/are-same.util';
export { camelCaseToSentenceCase } from './common/camel-case-to-sentence-case.util';
export { customSort } from './common/custom-sort.util';
export { takeRandomly } from './common/take-randomly.util';

export { formatDate } from './datetime/format-date.util';
export { isExpired } from './datetime/is-expired.util';
export { isValidIsoDate } from './datetime/is-valid-iso-date.util';
export { isValidTime } from './datetime/is-valid-time.util';

export { isMac } from './device/is-mac.util';
export { isTouchDevice } from './device/is-touch-device.util';

export { isLccError } from './error/is-lcc-error.util';
export { parseError } from './error/parse-error.util';

export { dataUrlToFile } from './file/data-url-to-file.util';
export { exportDataToCsv } from './file/export-data-to-csv.util';
export { exportEventsToIcal } from './file/export-events-to-ical.util';
export { formatBytes } from './file/format-bytes.util';
export { parseCsv } from './file/parse-csv.util';

export { setPaginationParams } from './http/set-pagination-params.util';

export {
  calculateAspectRatio,
  calculateDecimalAspectRatio,
} from './image/calculate-aspect-ratio.util';

export { actionSanitizer } from './store/action-sanitizer.util';

export { query, queryAll, queryTextContent } from './test/debug-element-queries.util';

export { isCollectionId } from './type-guards/is-collection-id.util';
export { isDefined } from './type-guards/is-defined.util';
export { isEntity } from './type-guards/is-entity.util';
export { isGameScore } from './type-guards/is-game-score.util';
export { isString } from './type-guards/is-string.util';
