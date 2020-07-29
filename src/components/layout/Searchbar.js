import { TouchableOpacity, View, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      showSearchBar: false,
    };
  }
  onClick() {
    let { showSearchBar } = this.state;
    this.setState({
      showSearchBar: !showSearchBar,
    });
  }

  render() {
    const { showSearchBar } = this.state;
    return (
      <View>
        {!showSearchBar ? (
          <TouchableOpacity onPress={this.onClick}>
            <Image
              source={require('../images/tabs/search.png')}
              style={{ height: 40, width: 60 }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        ) : (
          <SearchBar />
        )}
      </View>
    );
  }
}