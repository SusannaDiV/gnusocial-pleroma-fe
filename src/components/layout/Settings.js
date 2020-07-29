import React from "react";
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

import {
    SettingsPane,
    SettingsPage,
    SettingsContent,
    SettingsMenu
} from "react-settings-pane";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "mysettings.general.name": "Dennis Stücken",
            "mysettings.general.username": "dstuecken",
            "mysettings.general.color-theme": "purple",
            "mysettings.general.email": "dstuecken@react-settings-pane.com",
            "mysettings.general.picture": "earth",
            "mysettings.profile.firstname": "Dennis",
            "mysettings.profile.lastname": "Stücken",
        };

        this._leavePaneHandler = (wasSaved, newSettings, oldSettings) => {
            if (wasSaved && newSettings !== oldSettings) {
                this.setState(newSettings);
            }

            this.hidePrefs();
        };
        this._settingsChanged = ev => { };

        this._menu = [
            {
                title: "General", 
                url: "/settings/general" 
            },
            {
                title: "Avatar",
                url: "/settings/profile"
            },
            {
                title: "Notifications",
                url: "/settings/notifications"
            },
            {
                title: "Silenced Users",
                url: "/settings/language"
            },
            {
                title: "Appearance",
                url: "/settings/appearance"
            },
            {
                title: "Notifications",
                url: "/settings/plugins"
            },
            {
                title: "About",
                url: "/settings/about"
            }
        ];
    }

    hidePrefs() {
        this.prefs.className = "md-modal";
        this.overlay.style.visibility = "";
    }

    showPrefs() {
        this.prefs.className = "md-modal show";
        this.overlay.style.visibility = "visible";
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    render() {
        let settings = this.state;

        return (
            <div>
                <div>
                    <button onClick={this.showPrefs.bind(this)} className="w3-button w3-block w3-theme-d2 w3-section"><i className="fa fa-pencil"></i> Edit</button>
                </div>
                <div ref={ref => (this.overlay = ref)} className="overlay" />

                <div ref={ref => (this.prefs = ref)} className="md-modal">
                    <SettingsPane
                        items={this._menu}
                        index="/settings/general"
                        settings={settings}
                        onChange={this._settingsChanged}
                        onPaneLeave={this._leavePaneHandler}
                    >
                        <SettingsMenu headline="Settings" />
                        <SettingsContent header>
                            <SettingsPage handler="/settings/general">
                                <fieldset className="form-group">
                                    <label>Bio: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="bio"
                                        value={this.state.bio}
                                        placeholder="Bio"
                                        onChange={this.handleChange}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Website: </label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={this.state.website}
                                        className="form-control"
                                        placeholder="Website"
                                        onChange={this.handleChange}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Location: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="location"
                                        value={this.state.location}
                                        placeholder="Location"
                                        onChange={this.handleChange}
                                    />
                                </fieldset>
                            </SettingsPage>
                            <SettingsPage handler="/settings/profile">
                                <div className="w3-center w3-padding">
                                    <div className="profile-image">
                                        <img src="/static/media/no-img.6732bd42.png" className="w3-circle" alt="Avatar" />
                                        <input
                                            type="file"
                                            id="imageInput"
                                            hidden="hidden"
                                            onChange={this.handleImageChange}
                                        />
                                    </div>
                                    <p>Update your profile picture</p>
                                </div>
                            </SettingsPage>
                        </SettingsContent>
                    </SettingsPane>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(
    mapStateToProps,
    { editUserDetails }
)(Settings);