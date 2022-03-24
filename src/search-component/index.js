import React from "react";

import './search.css';

export default class Search extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            suggestions: [],
            searchtimeout: null
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(event) {
        clearTimeout(this.state.searchTimeout)

        var value = event.target.value;

        if (!value || value.length <= 0)
        {
            this.setState({ suggestions: [] })
            return;
        };

        console.log('====>', value);
        
        this.setState({
            searchTimeout: setTimeout(() => {
                this.getSuggestions(value);
              }, 300)
        });
        


        
    }

    componentDidMount()
    {
        //this.makeWords();
    }

    getSuggestions(value)
    {
        let everlasticSuggestUrl = "https://everlastic.net/api/searchcompletion/suggest?page=1&pagesize=20&size=10&verbose=false&index=www.austinregionalclinic.com&search=" + value;

        fetch(everlasticSuggestUrl)
        .then(res => res.json())
        .then(
          (result) => {
              console.log("Got suggestions:", result);
              this.setState({suggestions: result});

            // this.setState({
            //   isLoaded: true,
            //   items: result.items
            // });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
              console.Console.og("ERROR getting suggestions:", error);
            // this.setState({
            //   isLoaded: true,
            //   error
            // });
          }
        )
    }

    render() {
        const { suggestions } = this.state;
        
        let everlasticSearchURl = "https://everlastic.net/api/search/?includeKeymatches=true&page=1&pageSize=20&index=www.austinregionalclinic.com&highlightPre=%3Cstrong%3E&highlightPost=%3C/strong%3E&limitKeymatchesToStartsWith=true&q=";


        return (
            <div className="Search">
                <h2>Everlastic Search Suggestions in React</h2>
                <p>
                    Start typing a search to get search suggestions.
                </p>
                <input type="text" placeholder="Search..." value={this.state.search} onChange={this.handleSearchChange} />
                {
                    (suggestions && suggestions.length > 0) &&
                    <div>
                         <ul>
                        {suggestions.map(suggestion => (
                            <li key={suggestion}>
                                {suggestion}
                            </li>
                        ))}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}