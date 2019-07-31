import { connect } from 'react-redux'
import { saveRootUser } from '../../redux/actions';
import ChooseAuth from './chooseauth.view';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    saveRootUser: (data) => dispatch(saveRootUser(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseAuth);