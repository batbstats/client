import {combineReducers} from 'redux-loop';
import {handleAction} from 'redux-actions';
import {setPosture, setResult, setStance} from '../actions/settings';

export default combineReducers({
  result: handleAction(setResult, (state, {payload}) => payload, 'both'),
  stance: handleAction(setStance, (state, {payload}) => payload, 'both'),
  posture: handleAction(setPosture, (state, {payload}) => payload, 'both')
});
