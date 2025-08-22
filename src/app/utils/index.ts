export { isStorageSupported } from './browser/is-storage-supported.util';

export { areSame } from './common/are-same.util';
export { camelCaseToSentenceCase } from './common/camel-case-to-sentence-case.util';
export { isDefined } from './common/is-defined.util';
export { isString } from './common/is-string.util';
export { takeRandomly } from './common/take-randomly.util';

export { isMac } from './device/is-mac.util';
export { isTouchDevice } from './device/is-touch-device.util';

export { isValidCollectionId } from './database/is-valid-collection-id.util';
export { formatDate } from './datetime/format-date.util';
export { isSecondsInPast } from './datetime/is-seconds-in-past.util';
export { isValidIsoDate } from './datetime/is-valid-iso-date.util';
export { isValidTime } from './datetime/is-valid-time.util';

export { isLccError } from './error/is-lcc-error.util';
export { parseError } from './error/parse-error.util';

export { dataUrlToFile } from './file/data-url-to-file.util';
export { exportDataToCsv } from './file/export-data-to-csv.util';
export { formatBytes } from './file/format-bytes.util';
export { parseCsv } from './file/parse-csv.util';

export { setPaginationParams } from './http/set-pagination-params.util';

export {
  calculateAspectRatio,
  calculateDecimalAspectRatio,
} from './image/calculate-aspect-ratio.util';

export { getEcoOpeningCode } from './pgn/get-eco-opening-code.util';
export { getLichessAnalysisUrl } from './pgn/get-lichess-analysis-url.util';
export { getOpeningTallies } from './pgn/get-opening-tallies.util';
export { getPlayerName } from './pgn/get-player-name.util';
export { getPlyCount } from './pgn/get-ply-count.util';
export { getResultTallies } from './pgn/get-result-tallies.util';
export { getScore } from './pgn/get-score.util';

export { getNewPeakRating } from './rating/get-new-peak-rating.util';

export { customSort } from './sort/custom-sort.util';

export { actionSanitizer } from './store/action-sanitizer.util';

export { query, queryAll, queryTextContent } from './test/debug-element-queries.util';
