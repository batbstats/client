import api from '../api';
import {loop, Cmd} from 'redux-loop';
import {handleActions} from 'redux-actions';
import {load, success, failure} from '../actions/games';
import {success as skaterSuccess} from '../actions/skater';

async function fetchData(page = 1) {
  const response = await api.get(`/games?page=${page}`);
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

function createFetchDataCmd(args) {
  return Cmd.run(fetchData, {
    successActionCreator: success,
    failActionCreator: failure,
    args
  });
}

const defaultState = {
  loading: false,
  error: null,
  data: []
};

export default handleActions(
  {
    [load]: state =>
      loop(
        {
          ...state,
          loading: true
        },
        createFetchDataCmd()
      ),
    [failure]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [success]: (state, {payload}) => {
      const nextState = {
        ...state,
        data: [...state.data, ...payload.games]
      };

      if (payload.next_page) {
        return loop(nextState, createFetchDataCmd([payload.next_page]));
      }

      return {
        ...nextState,
        loading: false
      };
    },
    [skaterSuccess]: (state, {payload}) => ({
      ...state,
      data: state.data.map(game => ({
        ...game,
        skaters: game.skaters.map(
          skater => (skater.id === payload.id ? payload : skater)
        )
      }))
    })
  },
  defaultState
);
