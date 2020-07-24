import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

import MyButton from '../../util/MyButton';
import EditIcon from '@material-ui/icons/Edit';

import {
    SettingsPane,
    SettingsPage,
    SettingsContent,
    SettingsMenu
} from "react-settings-pane";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        // You will maybe receive your settings from this.props or do a fetch request in your componentWillMount
        // but here is an example of how it should look like:
        this.state = {
            "mysettings.general.name": "Dennis Stücken",
            "mysettings.general.username": "dstuecken",
            "mysettings.general.color-theme": "purple",
            "mysettings.general.email": "dstuecken@react-settings-pane.com",
            "mysettings.general.picture": "earth",
            "mysettings.profile.firstname": "Dennis",
            "mysettings.profile.lastname": "Stücken",
            // bio: '',
            // website: '',
            // location: '',
        };

        // Save settings after close
        this._leavePaneHandler = (wasSaved, newSettings, oldSettings) => {
            // "wasSaved" indicates wheather the pane was just closed or the save button was clicked.
            // this.handleSubmit();

            if (wasSaved && newSettings !== oldSettings) {
                // do something with the settings, e.g. save via ajax.
                this.setState(newSettings);
            }

            this.hidePrefs();
        };

        // React if a single setting changed
        this._settingsChanged = ev => { };

        // Define your menu
        this._menu = [
            {
                title: "General", // Title that is displayed as text in the menu
                url: "/settings/general" // Identifier (url-slug)
            },
            {
                title: "Avater",
                url: "/settings/profile"
            },
            {
                title: "Notifications",
                url: "/settings/notifications"
            },
            {
                title: "Language",
                url: "/settings/language"
            },
            {
                title: "Appearance",
                url: "/settings/appearance"
            },
            {
                title: "Plugins",
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

    // mapUserDetailsToState = (credentials) => {
    //     this.setState({
    //         bio: credentials.bio ? credentials.bio : '',
    //         website: credentials.website ? credentials.website : '',
    //         location: credentials.location ? credentials.location : ''
    //     });
    // };
    // handleOpen = () => {
    //     this.setState({ open: true });
    //     this.mapUserDetailsToState(this.props.credentials);
    // };
    // componentDidMount() {
    //     const { credentials } = this.props;
    //     this.mapUserDetailsToState(credentials);
    // }

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
        // Get settings
        let settings = this.state;

        // Define one of your Settings pages
        /*
         const dynamicOptionsForGeneralPage = [
           {
             key: null
             label: 'Account',
             type: 'headline',
           },
           {
             key: 'mysettings.general.email',
             label: 'E-Mail address',
             type: 'text',
           },
           {
             key: 'mysettings.general.password',
             label: 'Password',
             type: 'password',
           },
           {
             key: 'mysettings.general.password-repeat',
             label: 'Password repeat',
             type: 'password',
           },
           {
             key: null,
             label: 'Appearance',
             type: 'headline',
           },
           {
             key: 'mysettings.general.color-theme',
             label: 'Color Theme',
             type: 'custom',
             component: <select><option value="blue">Blue</option><option value="red">Red</option></select>,
           }
         ];
         // Then use with:
         // <SettingsPage handler="/settings/general" options={dynamicOptionsForGeneralPage} />
         */

        // Return your Settings Pane
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
                                        {/* <MyButton
                                            tip="Edit profile picture"
                                            onClick={this.handleEditPicture}
                                            btnClassName="button"
                                        >
                                            <EditIcon style={{ fill: "white" }} />
                                        </MyButton>
                                        <div className="overlay"></div> */}
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
                                {/* <fieldset className="form-group">
                                    <label htmlFor="profileFirstname">Firstname: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mysettings.profile.firstname"
                                        placeholder="Firstname"
                                        id="profileFirstname"
                                        onChange={this._settingsChanged}
                                        defaultValue={settings["mysettings.profile.firstname"]}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="profileLastname">Lastname: </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mysettings.profile.lastname"
                                        placeholder="Lastname"
                                        id="profileLastname"
                                        onChange={this._settingsChanged}
                                        defaultValue={settings["mysettings.profile.lastname"]}
                                    />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label htmlFor="profileBiography">Biography: </label>
                                    <textarea
                                        className="form-control"
                                        name="mysettings.profile.biography"
                                        placeholder="Biography"
                                        id="profileBiography"
                                        onChange={this._settingsChanged}
                                        defaultValue={settings["mysettings.profile.biography"]}
                                    />
                                </fieldset> */}
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

// export default Settings;