import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import { PROPOSAL_VOTING_AUTHORIZED } from "src/constants";
import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE
} from "../../constants";
import votesstatus from "src/legacyvotestatuses";

const DEFAULT_STATE = {
  // TODO: remove legacy
  byToken: votesstatus.votesstatus
    .map(st => {
      return {
        ...st,
        results: st.results.map(res => ({
          id: res.option.id,
          description: res.option.description,
          votebit: res.option.bits,
          votes: res.votesreceived
        }))
      };
    })
    .reduce((acc, cur) => ({
      ...acc,
      [cur.token]: cur
    }), {}),
  bestBlock: null
};

const receiveVoteStatusChange = (state, token, newStatus) =>
  update(["byToken", token.substring(0, 7)], (voteSummary) => ({
    ...voteSummary,
    status: newStatus
  }))(state);

const receiveMultiVoteStatusChange = (state, tokens, newStatus) => {
  tokens.forEach((token) => receiveVoteStatusChange(state, token, newStatus));
  return state;
};

const proposalVotes = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSALS_VOTE_SUMMARY]: () => {
            const keys = Object.keys(action.payload.summaries);
            const normalizedSummaries = keys.reduce(
              (acc, key) => ({
                ...acc,
                [key.substring(0, 7)]: {
                  ...state.byToken[key.substring(0, 7)],
                  ...action.payload.summaries[key]
                }
              }),
              {}
            );
            return compose(
              update("byToken", (voteSummaries) => ({
                ...voteSummaries,
                ...normalizedSummaries
              })),
              set("bestBlock", action.payload.bestblock)
            )(state);
          },
          [act.RECEIVE_VOTES_DETAILS]: () => {
            return update(
              ["byToken", action.payload.token.substring(0, 7)],
              (voteSummary) => ({
                ...voteSummary,
                details: {
                  auths: action.payload.auths,
                  details: action.payload.vote
                }
              })
            )(state);
          },
          [act.RECEIVE_PROPOSAL_VOTE_RESULTS]: () => {
            return update(
              ["byToken", action.payload.token.substring(0, 7)],
              (voteSummary) => ({
                ...voteSummary,
                votes: action.payload.votes
              })
            )(state);
          },
          [act.RECEIVE_AUTHORIZE_VOTE]: () =>
            receiveVoteStatusChange(
              state,
              action.payload.token,
              PROPOSAL_VOTING_AUTHORIZED
            ),
          [act.RECEIVE_REVOKE_AUTH_VOTE]: () =>
            receiveVoteStatusChange(
              state,
              action.payload.token,
              PROPOSAL_VOTING_NOT_AUTHORIZED
            ),
          [act.RECEIVE_START_VOTE]: () =>
            receiveMultiVoteStatusChange(
              state,
              action.payload.tokens,
              PROPOSAL_VOTING_ACTIVE
            )
        }[action.type] || (() => state)
      )();

export default proposalVotes;
