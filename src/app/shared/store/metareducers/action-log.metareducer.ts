import { ActionReducer } from '@ngrx/store';

export function actionLogMetareducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    const timestamp = new Date().toLocaleTimeString();
    console.info(`%c [${timestamp}] ${action.type} `, 'background: #ddd; color: #222');
    console.log('State:', state);
    console.log('Action:', action);

    return reducer(state, action);
  };
}
