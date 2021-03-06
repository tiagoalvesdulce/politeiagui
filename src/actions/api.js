import * as sel from "../selectors";
import * as api from "../lib/api";
import { basicAction } from "./lib";
import { PROPOSAL_STATUS_UNREVIEWED } from '../constants';

export const SET_EMAIL = "API_SET_EMAIL";
export const REQUEST_INIT_SESSION = "API_REQUEST_INIT_SESSION";
export const RECEIVE_INIT_SESSION = "API_RECEIVE_INIT_SESSION";
export const REQUEST_ME = "API_REQUEST_ME";
export const RECEIVE_ME = "API_RECEIVE_ME";
export const REQUEST_POLICY = "API_REQUEST_POLICY";
export const RECEIVE_POLICY = "API_RECEIVE_POLICY";
export const REQUEST_NEW_USER = "API_REQUEST_NEW_USER";
export const RECEIVE_NEW_USER = "API_RECEIVE_NEW_USER";
export const REQUEST_CHANGE_PASSWORD = "API_REQUEST_CHANGE_PASSWORD";
export const RECEIVE_CHANGE_PASSWORD = "API_RECEIVE_CHANGE_PASSWORD";
export const RESET_NEW_USER = "API_RESET_NEW_USER";
export const REQUEST_VERIFY_NEW_USER = "API_REQUEST_VERIFY_NEW_USER";
export const RECEIVE_VERIFY_NEW_USER = "API_RECEIVE_VERIFY_NEW_USER";
export const REQUEST_LOGIN = "API_REQUEST_LOGIN";
export const RECEIVE_LOGIN = "API_RECEIVE_LOGIN";
export const REQUEST_FORGOTTEN_PASSWORD_REQUEST = "API_REQUEST_FORGOTTEN_PASSWORD_REQUEST";
export const RECEIVE_FORGOTTEN_PASSWORD_REQUEST = "API_RECEIVE_FORGOTTEN_PASSWORD_REQUEST";
export const RESET_FORGOTTEN_PASSWORD_REQUEST = "RESET_FORGOTTEN_PASSWORD_REQUEST";
export const REQUEST_PASSWORD_RESET_REQUEST = "API_REQUEST_PASSWORD_RESET_REQUEST";
export const RECEIVE_PASSWORD_RESET_REQUEST = "API_RECEIVE_PASSWORD_RESET_REQUEST";
export const RESET_PASSWORD_RESET_REQUEST = "RESET_PASSWORD_RESET_REQUEST";
export const REQUEST_LOGOUT = "API_REQUEST_LOGOUT";
export const RECEIVE_LOGOUT = "API_RECEIVE_LOGOUT";
export const REQUEST_SECRET = "API_REQUEST_SECRET";
export const RECEIVE_SECRET = "API_RECEIVE_SECRET";
export const REQUEST_VETTED = "API_REQUEST_VETTED";
export const RECEIVE_VETTED = "API_RECEIVE_VETTED";
export const REQUEST_UNVETTED = "API_REQUEST_UNVETTED";
export const RECEIVE_UNVETTED = "API_RECEIVE_UNVETTED";
export const REQUEST_PROPOSAL = "API_REQUEST_PROPOSAL";
export const RECEIVE_PROPOSAL = "API_RECEIVE_PROPOSAL";
export const REQUEST_PROPOSAL_COMMENTS = "API_REQUEST_PROPOSAL_COMMENTS";
export const RECEIVE_PROPOSAL_COMMENTS = "API_RECEIVE_PROPOSAL_COMMENTS";
export const REQUEST_NEW_PROPOSAL = "API_REQUEST_NEW_PROPOSAL";
export const RECEIVE_NEW_PROPOSAL = "API_RECEIVE_NEW_PROPOSAL";
export const SUBMIT_PROPOSAL = "SUBMIT_PROPOSAL";
export const REQUEST_NEW_COMMENT = "API_REQUEST_NEW_COMMENT";
export const RECEIVE_NEW_COMMENT = "API_RECEIVE_NEW_COMMENT";
export const RESET_PROPOSAL = "API_RESET_PROPOSAL";
export const REQUEST_SETSTATUS_PROPOSAL = "API_REQUEST_SETSTATUS_PROPOSAL";
export const RECEIVE_SETSTATUS_PROPOSAL = "API_RECEIVE_SETSTATUS_PROPOSAL";
export const REDIRECTED_FROM = "REDIRECTED_FROM";
export const RESET_REDIRECTED_FROM = "RESET_REDIRECTED_FROM";

export const onRequestMe = basicAction(REQUEST_ME);
export const onReceiveMe = basicAction(RECEIVE_ME);
const onRequestInitSession = basicAction(REQUEST_INIT_SESSION);
const onReceiveInitSession = basicAction(RECEIVE_INIT_SESSION);
const onRedirectedFrom = basicAction(REDIRECTED_FROM);
export const onResetRedirectedFrom = basicAction(RESET_REDIRECTED_FROM);
const onRequestPolicy = basicAction(REQUEST_POLICY);
const onReceivePolicy = basicAction(RECEIVE_POLICY);
const onRequestNewUser = basicAction(REQUEST_NEW_USER);
const onReceiveNewUser = basicAction(RECEIVE_NEW_USER);
const onRequestChangePassword = basicAction(REQUEST_CHANGE_PASSWORD);
const onReceiveChangePassword = basicAction(RECEIVE_CHANGE_PASSWORD);
const onRequestVerifyNewUser = basicAction(REQUEST_VERIFY_NEW_USER);
// const onReceiveVerifyNewUser = basicAction(RECEIVE_VERIFY_NEW_USER);
const onRequestLogin = basicAction(REQUEST_LOGIN);
const onReceiveLogin = basicAction(RECEIVE_LOGIN);
const onRequestForgottenPasswordRequest = basicAction(REQUEST_FORGOTTEN_PASSWORD_REQUEST);
const onReceiveForgottenPasswordRequest = basicAction(RECEIVE_FORGOTTEN_PASSWORD_REQUEST);
const onResetForgottenPassword = basicAction(RESET_FORGOTTEN_PASSWORD_REQUEST);
const onRequestPasswordResetRequest = basicAction(REQUEST_PASSWORD_RESET_REQUEST);
const onReceivePasswordResetRequest = basicAction(RECEIVE_PASSWORD_RESET_REQUEST);
const onResetPasswordReset = basicAction(RESET_PASSWORD_RESET_REQUEST);
const onRequestLogout = basicAction(REQUEST_LOGOUT);
const onReceiveLogout = basicAction(RECEIVE_LOGOUT);
const onRequestVetted = basicAction(REQUEST_VETTED);
const onReceiveVetted = basicAction(RECEIVE_VETTED);
const onRequestUnvetted = basicAction(REQUEST_UNVETTED);
const onReceiveUnvetted = basicAction(RECEIVE_UNVETTED);
const onRequestProposal = basicAction(REQUEST_PROPOSAL);
const onReceiveProposal = basicAction(RECEIVE_PROPOSAL);
const onRequestProposalComments = basicAction(REQUEST_PROPOSAL_COMMENTS);
const onReceiveProposalComments = basicAction(RECEIVE_PROPOSAL_COMMENTS);
export const onRequestNewProposal = basicAction(REQUEST_NEW_PROPOSAL);
const onReceiveNewProposal = basicAction(RECEIVE_NEW_PROPOSAL);
const onRequestNewComment = basicAction(REQUEST_NEW_COMMENT);
const onReceiveNewComment = basicAction(RECEIVE_NEW_COMMENT);
export const onResetProposal = basicAction(RESET_PROPOSAL);
export const onRequestSetStatusProposal = basicAction(REQUEST_SETSTATUS_PROPOSAL);
const onReceiveSetStatusProposal = basicAction(RECEIVE_SETSTATUS_PROPOSAL);

export const onSetEmail = (payload) => ({ type: SET_EMAIL, payload });

export const onInit = () =>
  dispatch => {
    dispatch(onRequestMe());
    return api.me()
      .then(response => dispatch(onReceiveMe(response)))
      .catch(() => {
        dispatch(onRequestInitSession());
        return api.apiInfo()
          .then(response => dispatch(onReceiveInitSession(response)))
          .catch(error => {
            dispatch(onReceiveInitSession(null, error));
            throw error;
          });
      });
  };

export const onGetPolicy = () =>
  dispatch => {
    dispatch(onRequestPolicy());
    return api.policy()
      .then(response => dispatch(onReceivePolicy(response)))
      .catch(error => {
        dispatch(onReceivePolicy(null, error));
        throw error;
      });
  };

export const withCsrf = fn =>
  (dispatch, getState) => {
    const csrf = sel.csrf(getState());
    return csrf
      ? fn(dispatch, getState, csrf)
      : dispatch(onInit()).then(() => withCsrf(fn)(dispatch, getState));
  };

export const onCreateNewUser = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestNewUser({ email }));
    return api
      .newUser(csrf, email, password)
      .then(response => dispatch(onReceiveNewUser(response)))
      .catch(error => {
        dispatch(onReceiveNewUser(null, error));
        throw error;
      });
  });

export const onResetNewUser = () => ({ type: RESET_NEW_USER });

export const onVerifyNewUser = (searchQuery) =>
  (dispatch) => {
    dispatch(onRequestVerifyNewUser(searchQuery));
    return api
      .verifyNewUser(searchQuery);
  };

export const onSignup = (props) =>
  (dispatch) =>
    dispatch(onCreateNewUser(props));

export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestLogin({ email }));
    return api
      .login(csrf, email, password)
      .then(response => dispatch(onReceiveLogin(response)))
      .then(() => dispatch(onInit()))
      .catch(error => {
        dispatch(onReceiveLogin(null, error));
        throw error;
      });
  });

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestLogout());
    return api
      .logout(csrf)
      .then(response => {
        dispatch(onReceiveLogout(response));
        dispatch(onSetEmail(""));
      })
      .catch(error => dispatch(onReceiveLogout(null, error)));
  });

export const onChangePassword = ( password, newPassword ) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestChangePassword());
    return api
      .changePassword(csrf,  password, newPassword)
      .then(response => dispatch(onReceiveChangePassword(response)))
      .catch(error => {
        dispatch(onReceiveChangePassword(null, error));
        throw error;
      });
  });

export const onFetchVetted = () =>
  (dispatch) => {
    dispatch(onRequestVetted());
    return api
      .vetted()
      .then(response => dispatch(onReceiveVetted(response)))
      .catch(error => dispatch(onReceiveVetted(null, error)));
  };

export const onFetchUnvetted = () =>
  (dispatch) => {
    dispatch(onRequestUnvetted());
    return api
      .unvetted()
      .then(response => dispatch(onReceiveUnvetted(response)))
      .catch(error => dispatch(onReceiveUnvetted(null, error)));
  };

export const onFetchProposal = (token) =>
  (dispatch) => {
    dispatch(onRequestProposal(token));
    return api
      .proposal(token)
      .then(response => dispatch(onReceiveProposal(response)))
      .catch(error => dispatch(onReceiveProposal(null, error)));
  };

export const onFetchProposalComments = (token) =>
  (dispatch) => {
    dispatch(onRequestProposalComments(token));
    return api
      .proposalComments(token)
      .then(response => dispatch(onReceiveProposalComments(response)))
      .catch(error => dispatch(onReceiveProposalComments(null, error)));
  };

const onSubmitProposalSuccess = (proposal) => ({type: SUBMIT_PROPOSAL, payload: proposal});

export const onSubmitProposal = (name, description, files) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestNewProposal({ name, description, files }));
    return api
      .newProposal(csrf, name, description, files)
      .then(response => {
        const proposal = {
          censorshiprecord: { token: response.token },
          files: response.files,
          name,
          description,
          timestamp: Date.now() / 1000,
          status: PROPOSAL_STATUS_UNREVIEWED
        };
        dispatch(onSubmitProposalSuccess(proposal));
        return dispatch(onReceiveNewProposal(response));
      })
      .catch(error => {
        dispatch(onReceiveNewProposal(null, error));
        throw error;
      });
  });

export const onSubmitComment = (token, comment, parentid) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestNewComment({ token, comment, parentid }));
    return api
      .newComment(csrf, token, comment, parentid)
      .then(response => dispatch(onReceiveNewComment(response)))
      .catch(error => {
        dispatch(onReceiveNewComment(null, error));
        throw error;
      });
  });

const statusName = key => ({3: "censor", 4: "publish"}[key]);

export const onSubmitStatusProposal = (token, status) =>
  window.confirm(`Are you sure you want to ${statusName(status)} this proposal?`)
    ?  withCsrf((dispatch, getState, csrf) => {
      dispatch(onRequestSetStatusProposal({ status, token }));

      return api
        .proposalSetStatus(csrf, token, status)
        .then(response => dispatch(onReceiveSetStatusProposal(response)))
        .catch(error => dispatch(onReceiveSetStatusProposal(null, error)));
    })
    : {type: "NOOP"};

export const redirectedFrom = location => dispatch => {
  dispatch(onRedirectedFrom(location));
};

export const resetRedirectedFrom = () => dispatch => {
  dispatch(onResetRedirectedFrom());
};

export const onForgottenPasswordRequest = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestForgottenPasswordRequest({ email }));
    return api
      .forgottenPasswordRequest(csrf, email)
      .then(response => dispatch(onReceiveForgottenPasswordRequest(response)))
      .catch(error => {
        dispatch(onReceiveForgottenPasswordRequest(null, error));
        throw error;
      });
  });

export const resetForgottenPassword = () => dispatch => {
  dispatch(onResetForgottenPassword());
};

export const onPasswordResetRequest = ({ email, verificationtoken, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestPasswordResetRequest({ email, verificationtoken, password }));
    return api
      .passwordResetRequest(csrf, email, verificationtoken, password)
      .then(response => dispatch(onReceivePasswordResetRequest(response)))
      .catch(error => {
        dispatch(onReceivePasswordResetRequest(null, error));
        throw error;
      });
  });

export const resetPasswordReset = () => dispatch => {
  dispatch(onResetPasswordReset());
};
