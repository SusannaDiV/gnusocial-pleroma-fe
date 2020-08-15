import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scream from '../components/scream/Scream';
import ScreamSkeleton from '../util/ScreamSkeleton';
import PostStatus from '../components/scream/PostStatus';
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

class home extends Component {

    componentDidMount() {
        this.props.getPosts();
    }

    loadHome = async () => {
        await this.props.getPosts();
        this.render();
    }

    render() {
        console.log('Home component being rendered');
        const { posts, loading } = this.props.data;
        const isLoggedIn = localStorage.getItem('tokenStr') != null;

        let recentPostsMarkup = !loading ? (
            posts?.map((post) => <Scream key={post.id}  onLikeAction={ () => this.loadHome() } scream={post} />)
        ) : (
            <ScreamSkeleton />
        );
        return (
            <div>
                {isLoggedIn ?
                <div className="w3-card w3-round w3-white">
                    <div className="w3-container w3-padding-24">
                    <PostStatus />
                    </div>
                    </div> :
                    <div></div>
                }
                <div className="w3-container w3-padding w3-card w3-white w3-round w3-margin-top w3-margin-bottom">
                    <h5 className="w3-opacity">{this.props.user.authenticated ? 'Personal Timeline of ' + this.props.user.credentials.handle : 'Public Timeline'}</h5>
                </div>
                {recentPostsMarkup}
            </div>
        );
    }
}

home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data,
    user: state.user
});

export default connect(
    mapStateToProps,
    { getPosts }
)(home);
