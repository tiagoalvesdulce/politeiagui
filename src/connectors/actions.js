import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actions = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    email: sel.email,
    isAdmin: sel.isAdmin,
  }),
  {
    onChangeStatus: act.onSubmitStatusProposal
  }
);

export default actions;

