import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

class home extends Component {
  
  render() {    
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          //Futures <StatusMarkup />
        </Grid>
        <Grid item sm={4} xs={12}>
          //Future <Profile />
        </Grid>
      </Grid>
    );
  }
}
//Future
home.propTypes = {
  getStatus: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getStatus }
)(home);
